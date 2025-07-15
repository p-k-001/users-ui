import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Used when sending to API
interface UserInput {
  name: string;
  email: string;
  age: string;
  role: string;
}

// Used when receiving from API
interface User extends UserInput {
  id: string;
  adult: boolean;
}

interface ErrorMessage {
  msg?: string;
  message?: string;
}

type Role = "admin" | "user";

type TestApiFormProps = {
  isLoggedIn: boolean;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  error: ErrorMessage | ErrorMessage[] | null;
  setError: React.Dispatch<
    React.SetStateAction<ErrorMessage | ErrorMessage[] | null>
  >;
};
export default function TestApiForm({
  isLoggedIn,
  message,
  setMessage,
  error,
  setError,
}: TestApiFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [role, setRole] = useState<Role>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const loadUsers = () => {
    fetch(`${apiUrl}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [apiUrl]);

  const addUser = () => {
    setError(null);
    setMessage(null);

    fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email, age, role }),
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw errData;
          });
        }
        return res.json();
      })
      .then((newUser: User) => {
        if (newUser !== undefined) {
          setUsers((prevUsers) => [...prevUsers, newUser]);
          setMessage("User successfully added.");
          leaveEditing();
        } else {
          console.error("Received invalid user data:", newUser);
          setError({ message: "Server returned invalid user data" });
        }
      })
      .catch((err) => {
        console.error("Error adding user:", err);
        setError(err.errors ? err.errors : { message: "Failed to add user" });
      });
  };

  const deleteUser = (id: string) => {
    setMessage(null);
    fetch(`${apiUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw errData;
          });
        }
        return res;
      })
      .then(() => {
        loadUsers(); // refresh list from backend
      })
      .catch((err) => {
        setError(
          err.errors ? err.errors : { message: "Failed to delete user" }
        );
      });

    setSelectedUser(null);
    leaveEditing();
  };

  const deleteAllUsers = () => {
    setMessage(null);
    fetch(`${apiUrl}/users`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw errData;
          });
        }
        return res;
      })
      .then(() => {
        loadUsers(); // refresh list from backend
      })
      .catch((err) => {
        setError(
          err.errors ? err.errors : { message: "Failed to delete all user" }
        );
      });

    leaveEditing();
  };

  const updateUser = () => {
    if (!selectedUser) return;

    setError(null);
    setMessage(null);

    fetch(`${apiUrl}/users/${selectedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email, age: age, role }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw errData;
          });
        }

        return res.json();
      })
      .then((updatedUser: User) => {
        if (updatedUser && updatedUser.id !== undefined) {
          setUsers((prevUsers) =>
            prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
          );
          leaveEditing();
        } else {
          console.error("Received invalid user data:", updatedUser);
          setError({ message: "Server returned invalid user data" });
        }
      })

      .catch((err) => {
        console.error("Error updating user:", err);
        setError(
          err.errors ? err.errors : { message: "Failed to update user" }
        );
      });
  };

  const leaveEditing = () => {
    setSelectedUser(null);
    setName("");
    setEmail("");
    setAge("");
    setRole(undefined);
    setError(null);
  };

  return (
    <div>
      <h1>User Management</h1>

      {/* Display validation errors */}
      {error && (
        <div className="message error">
          {Array.isArray(error) ? (
            <ul>
              {error.map((err, index) => (
                <li key={index}>{err.msg}</li>
              ))}
            </ul>
          ) : (
            <p>{error.message || "An error occurred"}</p>
          )}
        </div>
      )}

      {message && <p>{message}</p>}

      {isLoggedIn && (
        <>
          {selectedUser && (
            <span className="bold">
              You are editting id <span data-testid="id-editted">{id}</span>:
            </span>
          )}

          <div className="user-input table-header bold">
            <span>{selectedUser && "id"}</span>
            <span>name</span>
            <span>email</span>
            <span>age</span>
            <span>role</span>
          </div>

          <div className="user-input">
            {selectedUser ? (
              <span>{id}</span>
            ) : (
              <span className="disabled"></span>
            )}
            <input
              type="text"
              placeholder="name"
              data-testid="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="email"
              data-testid="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="age"
              data-testid="age-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <select
              value={role ?? ""}
              data-testid="role-select"
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="">--Select role--</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            {isLoggedIn &&
              (selectedUser ? (
                <>
                  <button onClick={updateUser} data-testid="update-button">
                    Update user
                  </button>
                  <button onClick={leaveEditing} data-testid="leave-button">
                    Cancel editing
                  </button>
                </>
              ) : (
                <button onClick={addUser} data-testid="add-button">
                  Add user
                </button>
              ))}
          </div>
        </>
      )}
      <h2>List of Users</h2>
      <ul>
        <li className="user-list bold" data-testid="table-header">
          <span data-testid="id-header">id</span>
          <span data-testid="name-header">name</span>
          <span data-testid="email-header">email</span>
          <span data-testid="age-header">age</span>
          <span data-testid="role-header">role</span>
        </li>
        {users.map((user) => (
          <li key={user.id} className="user-list" data-testid="user-item">
            <span data-testid="id-item">{user.id}</span>
            <span data-testid="name-item">{user.name}</span>
            <span data-testid="email-item">{user.email}</span>
            <span data-testid="age-item">
              {user.age}
              {" - "}
              <span data-testid="is-adult">
                {user.adult ? "adult" : "not adult"}
              </span>
            </span>
            <span data-testid="role-item">{user.role}</span>
            {isLoggedIn && (
              <>
                <button
                  data-testid="delete-button"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setId(user.id);
                    setName(user.name);
                    setEmail(user.email);
                    setAge(user.age);
                    setRole(user.role as Role);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        {isLoggedIn && (
          <div>
            <button data-testid="deleteAll-button" onClick={deleteAllUsers}>
              Delete All Users
            </button>
          </div>
        )}
        <Link to="/swagger" data-testid="swagger-link">
          swagger
        </Link>
      </div>
    </div>
  );
}
