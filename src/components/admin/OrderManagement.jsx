import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useNavigate } from "react-router-dom";
import { Table, Input, Button } from "reactstrap";
import * as orderActions from "../../redux/actions/orderActions.jsx";
import alertify from "alertifyjs";

function OrderManagementWrapper(props) {
    const navigate = useNavigate();
    return <OrderManagement {...props} navigate={navigate} />;
}

class OrderManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            statusFilter: "all",
        };
    }

    componentDidMount() {
        if (!this.props.auth || !this.props.auth.isAuthenticated || !this.props.auth.user || this.props.auth.user.role !== "admin") {
            alertify.error("You are not authorized to view this page.");
            this.props.navigate("/");
            return;
        }
        this.props.actions.getOrders();
    }

    handleStatusChange = (orderId, newStatus) => {
        alertify.confirm(
            "Update Order Status",
            `Are you sure you want to change the order status to "${newStatus}"?`,
            () => {
                this.props.actions.updateOrderStatus(orderId, newStatus);
            },
            () => {
                alertify.error("Status update cancelled.");
            }
        );
    };

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleStatusFilterChange = (e) => {
        this.setState({ statusFilter: e.target.value });
    };

    formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return { bg: "#fef3c7", text: "#92400e" };
            case "shipped":
                return { bg: "#dbeafe", text: "#1e40af" };
            case "delivered":
                return { bg: "#d1fae5", text: "#065f46" };
            case "cancelled":
                return { bg: "#fee2e2", text: "#991b1b" };
            default:
                return { bg: "#f3f4f6", text: "#6b7280" };
        }
    };

    getFilteredOrders = () => {
        const { orders } = this.props;
        const { searchTerm, statusFilter } = this.state;

        if (!orders || !orders.orders) {
            return [];
        }

        let filtered = Array.isArray(orders.orders) ? orders.orders : [];

        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order && order.status === statusFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order &&
                    (order.orderNumber?.toLowerCase().includes(term) ||
                        order.username?.toLowerCase().includes(term) ||
                        order.shippingInfo?.firstName?.toLowerCase().includes(term) ||
                        order.shippingInfo?.lastName?.toLowerCase().includes(term) ||
                        order.shippingAddress?.firstName?.toLowerCase().includes(term) ||
                        order.shippingAddress?.lastName?.toLowerCase().includes(term))
            );
        }

        return filtered
            .filter((order) => order && order.orderDate)
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    };

    render() {
        const { auth } = this.props;
        const { searchTerm, statusFilter } = this.state;

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

        const filteredOrders = this.getFilteredOrders();

        return (
            <div style={{ padding: "3rem 0" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1
                        style={{
                            fontSize: "2rem",
                            fontWeight: "300",
                            letterSpacing: "2px",
                            color: "#1a1a1a",
                            marginBottom: "0.5rem",
                        }}
                    >
                        Order Management
                    </h1>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                        View and manage all customer orders
                    </p>
                </div>

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
                            placeholder="Search by order number, customer name..."
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
                            value={statusFilter}
                            onChange={this.handleStatusFilterChange}
                            style={{
                                width: "200px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0",
                                padding: "0.75rem 1rem",
                                fontSize: "0.875rem",
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </Input>
                    </div>

                    {filteredOrders.length > 0 ? (
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
                                            Order #
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
                                            Customer
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
                                            Date
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
                                            Items
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
                                            Total
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
                                            Status
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
                                    {filteredOrders.map((order) => {
                                        const statusColor = this.getStatusColor(order.status);
                                        return (
                                            <tr key={order.id}>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#1a1a1a",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    <Link
                                                        to={`/order/${order.id}`}
                                                        style={{
                                                            color: "#1a1a1a",
                                                            textDecoration: "none",
                                                            fontWeight: "500",
                                                        }}
                                                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                                                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                                                    >
                                                        {order.orderNumber || order.id}
                                                    </Link>
                                                </td>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#1a1a1a",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    {order.username || "N/A"}
                                                </td>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#6b7280",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    {this.formatDate(order.orderDate)}
                                                </td>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        color: "#1a1a1a",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    {order.items?.length || 0}
                                                </td>
                                                <td
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        fontWeight: "500",
                                                        color: "#1a1a1a",
                                                        padding: "1rem",
                                                    }}
                                                >
                                                    ${order.pricing?.total?.toFixed(2) || "0.00"}
                                                </td>
                                                <td style={{ padding: "1rem" }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            this.handleStatusChange(order.id, e.target.value)
                                                        }
                                                        style={{
                                                            padding: "0.5rem 1rem",
                                                            border: `1px solid ${statusColor.text}`,
                                                            borderRadius: "0",
                                                            backgroundColor: statusColor.bg,
                                                            color: statusColor.text,
                                                            fontSize: "0.75rem",
                                                            fontWeight: "600",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: "1rem" }}>
                                                    <Link
                                                        to={`/order/${order.id}`}
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            color: "#1a1a1a",
                                                            textDecoration: "none",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.5px",
                                                        }}
                                                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                                                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                                                    >
                                                        View
                                                    </Link>
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
                                No orders found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        orders: state.orderReducer,
        auth: state.authReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            getOrders: bindActionCreators(orderActions.getOrders, dispatch),
            updateOrderStatus: bindActionCreators(orderActions.updateOrderStatus, dispatch),
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagementWrapper);

