// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BillsManager
 * @dev Smart contract for managing recurring household bills
 */
contract BillsManager is Ownable, ReentrancyGuard {
    
    enum BillCategory {
        RENT,
        UTILITIES,
        INTERNET,
        INSURANCE,
        SUBSCRIPTION,
        OTHER
    }
    
    enum BillStatus {
        ACTIVE,
        PAUSED,
        CANCELLED
    }
    
    struct Bill {
        uint256 id;
        string name;
        string description;
        BillCategory category;
        uint256 amount; // Amount in USDC (6 decimals)
        uint256 dueDate; // Next due date (timestamp)
        uint256 frequency; // Frequency in seconds (monthly = 30 days)
        address payee; // Who receives the payment
        BillStatus status;
        uint256 totalPaid; // Total amount paid so far
        uint256 paymentCount; // Number of payments made
        uint256 createdAt;
        uint256 lastPaidAt;
    }
    
    struct BillPayment {
        uint256 billId;
        uint256 amount;
        uint256 paidAt;
        bytes32 transactionHash;
    }
    
    // State variables
    IERC20 public usdcToken;
    uint256 private billIdCounter;
    
    // Mappings
    mapping(address => uint256[]) public userBills; // user => bill IDs
    mapping(uint256 => Bill) public bills; // bill ID => Bill
    mapping(uint256 => BillPayment[]) public billPayments; // bill ID => payments
    mapping(address => uint256) public userTotalSpent; // user => total spent
    
    // Events
    event BillCreated(
        uint256 indexed billId,
        address indexed user,
        string name,
        BillCategory category,
        uint256 amount,
        uint256 dueDate
    );
    
    event BillPaid(
        uint256 indexed billId,
        address indexed user,
        uint256 amount,
        uint256 paidAt
    );
    
    event BillUpdated(
        uint256 indexed billId,
        address indexed user,
        BillStatus status
    );
    
    event BillDeleted(
        uint256 indexed billId,
        address indexed user
    );
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        billIdCounter = 1;
    }
    
    /**
     * @dev Create a new recurring bill
     */
    function createBill(
        string memory _name,
        string memory _description,
        BillCategory _category,
        uint256 _amount,
        uint256 _dueDate,
        uint256 _frequency,
        address _payee
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Bill name cannot be empty");
        require(_amount > 0, "Bill amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        require(_frequency > 0, "Frequency must be greater than 0");
        require(_payee != address(0), "Payee cannot be zero address");
        
        uint256 billId = billIdCounter++;
        
        bills[billId] = Bill({
            id: billId,
            name: _name,
            description: _description,
            category: _category,
            amount: _amount,
            dueDate: _dueDate,
            frequency: _frequency,
            payee: _payee,
            status: BillStatus.ACTIVE,
            totalPaid: 0,
            paymentCount: 0,
            createdAt: block.timestamp,
            lastPaidAt: 0
        });
        
        userBills[msg.sender].push(billId);
        
        emit BillCreated(billId, msg.sender, _name, _category, _amount, _dueDate);
        
        return billId;
    }
    
    /**
     * @dev Pay a bill
     */
    function payBill(uint256 _billId) external nonReentrant {
        Bill storage bill = bills[_billId];
        require(bill.id != 0, "Bill does not exist");
        require(bill.status == BillStatus.ACTIVE, "Bill is not active");
        require(isUserBill(msg.sender, _billId), "Not authorized to pay this bill");
        
        // Check if user has enough USDC balance
        require(usdcToken.balanceOf(msg.sender) >= bill.amount, "Insufficient USDC balance");
        
        // Check if user has approved enough USDC
        require(usdcToken.allowance(msg.sender, address(this)) >= bill.amount, "Insufficient USDC allowance");
        
        // Transfer USDC from user to payee
        require(usdcToken.transferFrom(msg.sender, bill.payee, bill.amount), "USDC transfer failed");
        
        // Update bill data
        bill.totalPaid += bill.amount;
        bill.paymentCount += 1;
        bill.lastPaidAt = block.timestamp;
        bill.dueDate += bill.frequency; // Set next due date
        
        // Update user total spent
        userTotalSpent[msg.sender] += bill.amount;
        
        // Record payment
        billPayments[_billId].push(BillPayment({
            billId: _billId,
            amount: bill.amount,
            paidAt: block.timestamp,
            transactionHash: blockhash(block.number - 1)
        }));
        
        emit BillPaid(_billId, msg.sender, bill.amount, block.timestamp);
    }
    
    /**
     * @dev Update bill status (pause, resume, cancel)
     */
    function updateBillStatus(uint256 _billId, BillStatus _status) external {
        require(isUserBill(msg.sender, _billId), "Not authorized to update this bill");
        
        Bill storage bill = bills[_billId];
        require(bill.id != 0, "Bill does not exist");
        
        bill.status = _status;
        
        emit BillUpdated(_billId, msg.sender, _status);
    }
    
    /**
     * @dev Delete a bill
     */
    function deleteBill(uint256 _billId) external {
        require(isUserBill(msg.sender, _billId), "Not authorized to delete this bill");
        
        Bill storage bill = bills[_billId];
        require(bill.id != 0, "Bill does not exist");
        
        // Remove from user's bill list
        uint256[] storage userBillList = userBills[msg.sender];
        for (uint256 i = 0; i < userBillList.length; i++) {
            if (userBillList[i] == _billId) {
                userBillList[i] = userBillList[userBillList.length - 1];
                userBillList.pop();
                break;
            }
        }
        
        // Delete bill data
        delete bills[_billId];
        delete billPayments[_billId];
        
        emit BillDeleted(_billId, msg.sender);
    }
    
    /**
     * @dev Get user's bills
     */
    function getUserBills(address _user) external view returns (uint256[] memory) {
        return userBills[_user];
    }
    
    /**
     * @dev Get bill details
     */
    function getBill(uint256 _billId) external view returns (Bill memory) {
        return bills[_billId];
    }
    
    /**
     * @dev Get bill payments history
     */
    function getBillPayments(uint256 _billId) external view returns (BillPayment[] memory) {
        return billPayments[_billId];
    }
    
    /**
     * @dev Get overdue bills for a user
     */
    function getOverdueBills(address _user) external view returns (uint256[] memory) {
        uint256[] memory userBillIds = userBills[_user];
        uint256[] memory overdueBills = new uint256[](userBillIds.length);
        uint256 overdueCount = 0;
        
        for (uint256 i = 0; i < userBillIds.length; i++) {
            Bill memory bill = bills[userBillIds[i]];
            if (bill.status == BillStatus.ACTIVE && bill.dueDate < block.timestamp) {
                overdueBills[overdueCount] = userBillIds[i];
                overdueCount++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](overdueCount);
        for (uint256 i = 0; i < overdueCount; i++) {
            result[i] = overdueBills[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get upcoming bills (due in next 7 days)
     */
    function getUpcomingBills(address _user) external view returns (uint256[] memory) {
        uint256[] memory userBillIds = userBills[_user];
        uint256[] memory upcomingBills = new uint256[](userBillIds.length);
        uint256 upcomingCount = 0;
        uint256 nextWeek = block.timestamp + 7 days;
        
        for (uint256 i = 0; i < userBillIds.length; i++) {
            Bill memory bill = bills[userBillIds[i]];
            if (bill.status == BillStatus.ACTIVE && 
                bill.dueDate >= block.timestamp && 
                bill.dueDate <= nextWeek) {
                upcomingBills[upcomingCount] = userBillIds[i];
                upcomingCount++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](upcomingCount);
        for (uint256 i = 0; i < upcomingCount; i++) {
            result[i] = upcomingBills[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get user's spending summary
     */
    function getUserSpendingSummary(address _user) external view returns (
        uint256 totalSpent,
        uint256 activeBillsCount,
        uint256 overdueBillsCount,
        uint256 monthlyBudget
    ) {
        totalSpent = userTotalSpent[_user];
        
        uint256[] memory userBillIds = userBills[_user];
        uint256 activeBills = 0;
        uint256 overdueBills = 0;
        uint256 monthlyTotal = 0;
        
        for (uint256 i = 0; i < userBillIds.length; i++) {
            Bill memory bill = bills[userBillIds[i]];
            if (bill.status == BillStatus.ACTIVE) {
                activeBills++;
                
                // Calculate monthly equivalent
                if (bill.frequency <= 30 days) {
                    monthlyTotal += bill.amount;
                } else {
                    monthlyTotal += (bill.amount * 30 days) / bill.frequency;
                }
                
                if (bill.dueDate < block.timestamp) {
                    overdueBills++;
                }
            }
        }
        
        return (totalSpent, activeBills, overdueBills, monthlyTotal);
    }
    
    /**
     * @dev Check if a bill belongs to a user
     */
    function isUserBill(address _user, uint256 _billId) public view returns (bool) {
        uint256[] memory userBillIds = userBills[_user];
        for (uint256 i = 0; i < userBillIds.length; i++) {
            if (userBillIds[i] == _billId) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Emergency function to update USDC token address (only owner)
     */
    function updateUSDCToken(address _newUSDCToken) external onlyOwner {
        require(_newUSDCToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_newUSDCToken);
    }
}