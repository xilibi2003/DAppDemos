pragma solidity  >0.4.23 <0.7.0;

contract InfoContract {
    string name;
    uint age;

    event Instructor(string name, uint age);

    function setInfo(string memory _name, uint _age) public {
        name = _name;
        age = _age;
        emit Instructor(name, age);
    }

    function getInfo() public view returns(string memory, uint) {
        return (name, age);
    }
}
