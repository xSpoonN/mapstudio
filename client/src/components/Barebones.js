import React, { useState, useEffect } from 'react';
const url = (route) => { return "https://mapstudio.azurewebsites.net/" + route };

function Barebones() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateAge, setUpdateAge] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetch(url('api/people'))
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleCreateUser = () => {
    fetch(url('api/people'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age }),
    })
      .then(() => {
        setName('');
        setAge('');
        fetchUsers();
      })
      .catch((error) => console.error('Error creating user:', error));
    setName('')
    setAge('')
    setUpdateName('')
    setUpdateAge('')
    setSelectedUserId('')
  };

  const handleUpdateUser = () => {
    fetch(url(`api/people/${selectedUserId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: updateName, age: updateAge }),
    })
      .then(() => {
        setSelectedUserId('');
        setUpdateName('');
        setUpdateAge('');
        fetchUsers();
      })
      .catch((error) => console.error('Error updating user:', error));
    setName('')
    setAge('')
    setUpdateName('')
    setUpdateAge('')
    setSelectedUserId('')
  };

  const handleDeleteUser = () => {
    fetch(url(`api/people/${selectedUserId}`), {
      method: 'DELETE',
    })
      .then(() => {
        setSelectedUserId('');
        fetchUsers();
      })
      .catch((error) => console.error('Error deleting user:', error));
    setName('')
    setAge('')
    setUpdateName('')
    setUpdateAge('')
    setSelectedUserId('')
  };

  const fetchUsers = () => {
    fetch(url('api/people'))
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  return (
    <div className="App">
      <div>
        <h2>Create User</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <div>
        <h2>Users List</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => {
                setSelectedUserId(user._id);
                setUpdateName(user.name);
                setUpdateAge(user.age);
              }}
            >
              Name: {user.name}, Age: {user.age}, ID: {user._id}
            </li>
          ))}
        </ul>
      </div>

      {selectedUserId && ( // Check if a user is selected
        <div>
          <h2>Update User</h2>
          <input
            type="text"
            placeholder="Name"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={updateAge}
            onChange={(e) => setUpdateAge(e.target.value)}
          />
          <button onClick={handleUpdateUser}>Update</button>
        
          <h2>Delete User</h2>
          <input
            type="text"
            placeholder="User ID"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
          <button onClick={handleDeleteUser}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Barebones;