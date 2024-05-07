import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Person 1",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -60,
  },
  {
    id: 933372,
    name: "Person 2",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 100,
  },
  {
    id: 499476,
    name: "Person 3",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, SetFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowHideFriend(){
    setShowAddFriend((field)=>!field);
  }
  function handleAddFriend(friend){
    SetFriends((friends)=>[...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelectedFriend(friend){
    setSelectedFriend(friend);
  }
  function handleSplitBill(value){
    SetFriends(friends=>friends.map(friend=>friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} selectedFriend={selectedFriend} onSelection={handleSelectedFriend} />
        {showAddFriend && <FormAddFriend addFriend={handleAddFriend}/>}
        {!showAddFriend ? 
          <Button onClick={handleShowHideFriend}>Add Friend</Button> 
          : 
          <Button onClick={handleShowHideFriend}>Close</Button>
        }
      </div>
      {selectedFriend && <FormSplitBill key={selectedFriend.id} selectedFriend={selectedFriend} splitBill={handleSplitBill} />}
    </div>
  );
}

function FriendsList({friends, onSelection, selectedFriend}){
  return <ul>
    {friends.map(friend=><Friend key={friend.key} friend={friend} onSelection={onSelection} selectedFriend={selectedFriend}/>)}
  </ul>
}

function Friend({ friend, onSelection, selectedFriend }){
  let isSelected = selectedFriend?.id === friend.id;
  return <li className={isSelected ? "selected" : ""}>
          <img src={friend.image} alt={friend.name}></img>
          <h3>{friend.name}</h3>
          {friend.balance < 0 && (
            <p className="red">You Owe {friend.name} Rs {Math.abs(friend.balance)}</p>
          )}
          {friend.balance > 0 && (
            <p className="green">{friend.name} Owes You Rs {Math.abs(friend.balance)}</p>
          )}
          {friend.balance === 0 && (
            <p>You are even.</p>
          )}
          {!isSelected ? 
            <Button onClick={()=>{onSelection(friend)}}>Select</Button> 
            :
            <Button onClick={()=>{onSelection(null)}}>Close</Button>}
        </li>
}

function FormAddFriend({ addFriend }){
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e){
    e.preventDefault();
    if(!name) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }
    addFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return <form className="form-add-friend" onSubmit={handleSubmit}>

      <label>A Friend Name</label>
      <input type="text" value={name} onChange={e=>setName(e.target.value)}></input>

      <label>📷Image URL</label>
      <input type="text" value={image} onChange={e=>setImage(e.target.value)} disabled="true"></input>

      <Button>Add</Button>

    </form>
}

function Button({ children, onClick }){
  return <button className="button" onClick={onClick}>{children}</button>
}

function FormSplitBill({ selectedFriend, splitBill }){
  const [bill, setBill] = useState(0);
  const [expense, setExpense] = useState(0);
  const [paying, setPaying] = useState("user");
  let friendExpense = bill - expense;

  function handleSubmit(e){
    e.preventDefault();
    if(bill === 0) return null;
    splitBill(paying === 'user' ? friendExpense : -expense);
  }

  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a bill with {selectedFriend.name}</h2>

    <label>💵 Bill Value</label>
    <input type="text" value={bill} onChange={(e)=>{setBill(Number(e.target.value))}}></input>

    <label> 💰 Your Expense</label>
    <input type="text" 
    value={expense} 
    onChange={(e)=>
      {setExpense(
        Number(e.target.value) > bill ? expense : Number(e.target.value)
      )
      }
    }>
    </input>

    <label> 😊{selectedFriend.name}'s expense</label>
    <input type="text" disabled value={friendExpense}></input>

    <label> 💰 Who is Paying the Bill</label>
    <select value={paying} onChange={(e)=>{setPaying(e.target.value)}}>
      <option value="user">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>
    <Button>Split Bill</Button>
  </form>
}

export default App;
