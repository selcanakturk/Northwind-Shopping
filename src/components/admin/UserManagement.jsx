import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate } from "react-router-dom";
import { Table, Input, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from "reactstrap";
import * as userActions from "../../redux/actions/userActions.jsx";
import alertify from "alertifyjs";

function UserManagementWrapper(props) {
    const navigate = useNavigate();
    return <UserManagement {...props} navigate={navigate} />;
}

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            roleFilter: "all",
            showAddModal: false,
            showEditModal: false,
            selectedUser: null,
            formData: {
                username: "",
                email: "",
                password: "",
                role: "user",
            },
            formErrors: {},
        };
    }

    componentDidMount() {
        if (!this.props.auth || !this.props.auth.isAuthenticated || !this.props.auth.user || this.props.auth.user.role !== "admin") {
            alertify.error("You are not authorized to view this page.");
            this.props.navigate("/");
            return;
        }
        this.props.actions.getUsers();
    }

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleRoleFilterChange = (e) => {
        this.setState({ roleFilter: e.target.value });
    };

    handleAddUser = () => {
        this.setState({
            showAddModal: true,
            formData: {
                username: "",
                email: "",
                password: "",
                role: "user",
            },
            formErrors: {},
        });
    };

    handleEditUser = (user) => {
        this.setState({
            showEditModal: true,
            selectedUser: user,
            formData: {
                username: user.username,
                email: user.email,
                password: "",
                role: user.role,
            },
            formErrors: {},
        });
    };

    handleFormChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value,
            },
            formErrors: {
                ...this.state.formErrors,
                [name]: "",
            },
        });
    };

    validateForm = (isEdit = false) => {
        const errors = {};
        const { username, email, password, role } = this.state.formData;

        if (!username || username.trim() === "") {
            errors.username = "Username is required";
        }

        if (!email || email.trim() === "") {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Invalid email format";
        }

        if (!isEdit && (!password || password.length < 6)) {
            errors.password = "Password must be at least 6 characters";
        }

        if (!role) {
            errors.role = "Role is required";
        }

        this.setState({ formErrors: errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmitAdd = (e) => {
        e.preventDefault();
        if (!this.validateForm(false)) {
            return;
        }

        this.props.actions.createUser(this.state.formData);
        this.setState({
            showAddModal: false,
            formData: {
                username: "",
                email: "",
                password: "",
                role: "user",
            },
        });
    };

    handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!this.validateForm(true)) {
            return;
        }

        const updateData = {
            username: this.state.formData.username,
            email: this.state.formData.email,
            role: this.state.formData.role,
        };

        if (this.state.formData.password && this.state.formData.password.length > 0) {
            if (this.state.formData.password.length < 6) {
                this.setState({
                    formErrors: {
                        ...this.state.formErrors,
                        password: "Password must be at least 6 characters",
                    },
                });
                return;
            }
            updateData.password = this.state.formData.password;
        }

        this.props.actions.updateUser(this.state.selectedUser.id, updateData);
        this.setState({
            showEditModal: false,
            selectedUser: null,
            formData: {
                username: "",
                email: "",
                password: "",
                role: "user",
            },
        });
    };

    handleDeleteUser = (userId, username) => {
        alertify.confirm(
            "Delete User",
            `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
            () => {
                this.props.actions.deleteUser(userId);
            },
            () => {
                alertify.error("Deletion cancelled.");
            }
        );
    };

    handleRoleChange = (userId, newRole) => {
        alertify.confirm(
            "Change User Role",
            `Are you sure you want to change this user's role to "${newRole}"?`,
            () => {
                this.props.actions.updateUserRole(userId, newRole);
            },
            () => {
                alertify.error("Role change cancelled.");
            }
        );
    };

    getUserStatistics = () => {
        const { users } = this.props;
        if (!users || !users.users) {
            return { total: 0, admins: 0, regularUsers: 0 };
        }

        const allUsers = users.users || [];
        return {
            total: allUsers.length,
            admins: allUsers.filter(u => u.role === "admin").length,
            regularUsers: allUsers.filter(u => u.role === "user").length,
        };
    };

    getFilteredUsers = () => {
        const { users } = this.props;
        const { searchTerm, roleFilter } = this.state;

        if (!users || !users.users) {
            return [];
        }

        let filtered = Array.isArray(users.users) ? users.users : [];

        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user && user.role === roleFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user &&
                    (user.username?.toLowerCase().includes(term) ||
                        user.email?.toLowerCase().includes(term))
            );
        }

        return filtered.sort((a, b) => {
            if (a.role === "admin" && b.role !== "admin") return -1;
            if (a.role !== "admin" && b.role === "admin") return 1;
            return a.id - b.id;
        });
    };

    render() {
        const { auth } = this.props;
        const { searchTerm, roleFilter, showAddModal, showEditModal, formData, formErrors } = this.state;

        if (!auth || !auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
            return (
                <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: "300", marginBottom: "1rem" }}>
                        Access Denied
                    </h2>
                    <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
                        You do not have permission to view this page.
                    </p>
                </div>
            );
        }

        const filteredUsers = this.getFilteredUsers();
        const stats = this.getUserStatistics();

        return (
            <div style={{ padding: "3rem 0" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div>
                            <h1
                                style={{
                                    fontSize: "2rem",
                                    fontWeight: "300",
                                    letterSpacing: "2px",
                                    color: "#1a1a1a",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                User Management
                            </h1>
                            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                                Manage all users and their roles
                            </p>
                        </div>
                        <Button
                            onClick={this.handleAddUser}
                            style={{
                                backgroundColor: "#1a1a1a",
                                color: "#ffffff",
                                border: "none",
                                fontSize: "0.875rem",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                padding: "0.75rem 1.5rem",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#000000";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#1a1a1a";
                            }}
                        >
                            Add User
                        </Button>
                    </div>
                </div>

                <Row className="g-4" style={{ marginBottom: "2rem" }}>
                    <Col md="4" sm="6">
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#ffffff",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                                {stats.total}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Total Users
                            </div>
                        </div>
                    </Col>
                    <Col md="4" sm="6">
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#ffffff",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                                {stats.admins}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Admins
                            </div>
                        </div>
                    </Col>
                    <Col md="4" sm="6">
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#ffffff",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                                {stats.regularUsers}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Regular Users
                            </div>
                        </div>
                    </Col>
                </Row>

                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        padding: "2rem",
                        marginBottom: "2rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            marginBottom: "1.5rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="Search by username or email..."
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                            style={{
                                flex: "1",
                                minWidth: "250px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0",
                                padding: "0.75rem 1rem",
                                fontSize: "0.875rem",
                            }}
                        />
                        <Input
                            type="select"
                            value={roleFilter}
                            onChange={this.handleRoleFilterChange}
                            style={{
                                width: "200px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0",
                                padding: "0.75rem 1rem",
                                fontSize: "0.875rem",
                            }}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </Input>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <div style={{ overflowX: "auto" }}>
                            <Table striped borderless responsive>
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                fontSize: "0.875rem",
                                                fontWeight: "600",
                                                color: "#6b7280",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                borderTop: "none",
                                                padding: "1rem",
                                            }}
                                        >
                                            ID
                                        </th>
                                        <th
                                            style={{
                                                fontSize: "0.875rem",
                                                fontWeight: "600",
                                                color: "#6b7280",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                borderTop: "none",
                                                padding: "1rem",
                                            }}
                                        >
                                            Username
                                        </th>
                                        <th
                                            style={{
                                                fontSize: "0.875rem",
                                                fontWeight: "600",
                                                color: "#6b7280",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                borderTop: "none",
                                                padding: "1rem",
                                            }}
                                        >
                                            Email
                                        </th>
                                        <th
                                            style={{
                                                fontSize: "0.875rem",
                                                fontWeight: "600",
                                                color: "#6b7280",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                borderTop: "none",
                                                padding: "1rem",
                                            }}
                                        >
                                            Role
                                        </th>
                                        <th
                                            style={{
                                                fontSize: "0.875rem",
                                                fontWeight: "600",
                                                color: "#6b7280",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                borderTop: "none",
                                                padding: "1rem",
                                            }}
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const isCurrentUser = auth.user && auth.user.id === user.id;
                                        return (
                                            <tr key={user.id}>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#1a1a1a",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    {user.id}
                                                </td>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#1a1a1a",
                                                        padding: "1rem",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {user.username}
                                                </td>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#6b7280",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    {user.email}
                                                </td>
                                                <td style={{ padding: "1rem" }}>
                                                    {isCurrentUser ? (
                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                padding: "0.5rem 1rem",
                                                                backgroundColor: "#1a1a1a",
                                                                color: "#ffffff",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "600",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.5px",
                                                            }}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    ) : (
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) =>
                                                                this.handleRoleChange(user.id, e.target.value)
                                                            }
                                                            style={{
                                                                padding: "0.5rem 1rem",
                                                                border: user.role === "admin" ? "1px solid #1a1a1a" : "1px solid #e5e7eb",
                                                                borderRadius: "0",
                                                                backgroundColor: user.role === "admin" ? "#1a1a1a" : "#ffffff",
                                                                color: user.role === "admin" ? "#ffffff" : "#1a1a1a",
                                                                fontSize: "0.75rem",
                                                                fontWeight: "600",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.5px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    )}
                                                </td>
                                                <td style={{ padding: "1rem" }}>
                                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                                        <button
                                                            onClick={() => this.handleEditUser(user)}
                                                            style={{
                                                                background: "transparent",
                                                                border: "1px solid #1a1a1a",
                                                                color: "#1a1a1a",
                                                                cursor: "pointer",
                                                                fontSize: "0.75rem",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.5px",
                                                                padding: "0.5rem 1rem",
                                                                transition: "all 0.2s ease",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = "#1a1a1a";
                                                                e.target.style.color = "#ffffff";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = "transparent";
                                                                e.target.style.color = "#1a1a1a";
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        {!isCurrentUser && user.role !== "admin" && (
                                                            <button
                                                                onClick={() => this.handleDeleteUser(user.id, user.username)}
                                                                style={{
                                                                    background: "transparent",
                                                                    border: "none",
                                                                    color: "#ef4444",
                                                                    cursor: "pointer",
                                                                    fontSize: "0.75rem",
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.5px",
                                                                    padding: "0.5rem 1rem",
                                                                }}
                                                                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                                                                onMouseLeave={(e) => (e.target.style.opacity = "1")}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "3rem 2rem",
                                color: "#6b7280",
                            }}
                        >
                            <p style={{ fontSize: "0.875rem", margin: 0 }}>
                                No users found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>

                <Modal isOpen={showAddModal} toggle={() => this.setState({ showAddModal: false })}>
                    <ModalHeader toggle={() => this.setState({ showAddModal: false })}>
                        Add New User
                    </ModalHeader>
                    <Form onSubmit={this.handleSubmitAdd}>
                        <ModalBody>
                            <FormGroup>
                                <Label
                                    for="username"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Username <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={this.handleFormChange}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                />
                                {formErrors.username && (
                                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                        {formErrors.username}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="email"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Email <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={this.handleFormChange}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                />
                                {formErrors.email && (
                                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                        {formErrors.email}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="password"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Password <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={this.handleFormChange}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                />
                                {formErrors.password && (
                                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                        {formErrors.password}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="role"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Role <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    name="role"
                                    id="role"
                                    value={formData.role}
                                    onChange={this.handleFormChange}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                type="button"
                                onClick={() => this.setState({ showAddModal: false })}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#6b7280",
                                    border: "1px solid #e5e7eb",
                                    fontSize: "0.875rem",
                                    padding: "0.75rem 1.5rem",
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: "#1a1a1a",
                                    color: "#ffffff",
                                    border: "none",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    padding: "0.75rem 1.5rem",
                                }}
                            >
                                Add User
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                <Modal isOpen={showEditModal} toggle={() => this.setState({ showEditModal: false })}>
                    <ModalHeader toggle={() => this.setState({ showEditModal: false })}>
                        Edit User
                    </ModalHeader>
                    <Form onSubmit={this.handleSubmitEdit}>
                        <ModalBody>
                            <FormGroup>
                                <Label
                                    for="edit-username"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Username <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="edit-username"
                                    value={formData.username}
                                    onChange={this.handleFormChange}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                />
                                {formErrors.username && (
                                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                        {formErrors.username}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="edit-email"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Email <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="edit-email"
                                    value={formData.email}
                                    onChange={this.handleFormChange}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                />
                                {formErrors.email && (
                                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                        {formErrors.email}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="edit-password"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Password (leave blank to keep current)
                                </Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="edit-password"
                                    value={formData.password}
                                    onChange={this.handleFormChange}
                                    placeholder="Enter new password"
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                    }}
                                />
                                {formErrors.password && (
                                    <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                        {formErrors.password}
                                    </div>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <Label
                                    for="edit-role"
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        color: "#1a1a1a",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Role <span style={{ color: "#ef4444" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    name="role"
                                    id="edit-role"
                                    value={formData.role}
                                    onChange={this.handleFormChange}
                                    disabled={this.state.selectedUser && this.state.selectedUser.role === "admin"}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "0",
                                        padding: "0.75rem",
                                        backgroundColor: this.state.selectedUser && this.state.selectedUser.role === "admin" ? "#f9fafb" : "#ffffff",
                                    }}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                type="button"
                                onClick={() => this.setState({ showEditModal: false })}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#6b7280",
                                    border: "1px solid #e5e7eb",
                                    fontSize: "0.875rem",
                                    padding: "0.75rem 1.5rem",
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: "#1a1a1a",
                                    color: "#ffffff",
                                    border: "none",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    padding: "0.75rem 1.5rem",
                                }}
                            >
                                Update User
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.userReducer,
        auth: state.authReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            getUsers: bindActionCreators(userActions.getUsers, dispatch),
            createUser: bindActionCreators(userActions.createUser, dispatch),
            updateUser: bindActionCreators(userActions.updateUser, dispatch),
            deleteUser: bindActionCreators(userActions.deleteUser, dispatch),
            updateUserRole: bindActionCreators(userActions.updateUserRole, dispatch),
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementWrapper);

