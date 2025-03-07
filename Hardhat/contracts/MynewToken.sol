// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyToken is ERC20, ERC20Permit, Ownable, Pausable {
    // Staking
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingTimestamp;
    uint256 public rewardRate = 100; // 1% par an
    
    // Gouvernance
    struct Proposal {
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    Proposal[] public proposals;
    uint256 public constant VOTING_PERIOD = 3 days;
    
    // Timelock
    mapping(address => uint256) public timelockEndTime;
    uint256 public constant TIMELOCK_DURATION = 1 days;
    
    // Rate Limiting
    mapping(address => uint256) public lastTransferTimestamp;
    uint256 public constant TRANSFER_COOLDOWN = 1 minutes;
    uint256 public constant MAX_TRANSFER_AMOUNT = 1000 * 10**18; // 1000 tokens
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(uint256 initialSupply) 
        ERC20("MyToken", "MTK") 
        ERC20Permit("MyToken")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
    
    // Staking Functions
    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        
        if (stakedBalance[msg.sender] > 0) {
            claimReward();
        }
        
        stakedBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        
        claimReward();
        stakedBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    function claimReward() public {
        require(stakedBalance[msg.sender] > 0, "No staked balance");
        
        uint256 reward = calculateReward(msg.sender);
        if (reward > 0) {
            _mint(msg.sender, reward);
            stakingTimestamp[msg.sender] = block.timestamp;
            
            emit RewardClaimed(msg.sender, reward);
        }
    }
    
    function calculateReward(address user) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - stakingTimestamp[user];
        return (stakedBalance[user] * timeElapsed * rewardRate) / (365 days * 10000);
    }
    
    // Governance Functions
    function createProposal(string memory description) external {
        require(stakedBalance[msg.sender] > 0, "Must be staker to propose");
        
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        
        emit ProposalCreated(proposals.length - 1, description);
    }
    
    function vote(uint256 proposalId, bool support) external {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(stakedBalance[msg.sender] > 0, "Must be staker to vote");
        
        if (support) {
            proposal.forVotes += stakedBalance[msg.sender];
        } else {
            proposal.againstVotes += stakedBalance[msg.sender];
        }
        
        proposal.hasVoted[msg.sender] = true;
        
        emit Voted(proposalId, msg.sender, support);
    }
    
    // Transfer with Rate Limiting
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        require(amount <= MAX_TRANSFER_AMOUNT, "Amount exceeds transfer limit");
        require(block.timestamp >= lastTransferTimestamp[msg.sender] + TRANSFER_COOLDOWN, "Transfer cooldown active");
        
        lastTransferTimestamp[msg.sender] = block.timestamp;
        return super.transfer(to, amount);
    }
    
    // Admin Functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Rate too high"); // Max 10%
        rewardRate = newRate;
    }
}

