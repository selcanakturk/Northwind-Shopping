import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, useNavigate } from "react-router-dom";
import { Table, Input, Button, Row, Col } from "reactstrap";
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
            dateFrom: "",
            dateTo: "",
            selectedOrders: [],
            showBulkActions: false,
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

    handleDeleteOrder = (orderId, orderNumber) => {
        alertify.confirm(
            "Delete Order",
            `Are you sure you want to delete order ${orderNumber || orderId}? This action cannot be undone.`,
            () => {
                this.props.actions.deleteOrder(orderId);
                this.setState({ selectedOrders: this.state.selectedOrders.filter(id => id !== orderId) });
            },
            () => {
                alertify.error("Deletion cancelled.");
            }
        );
    };

    handleBulkStatusChange = (newStatus) => {
        if (this.state.selectedOrders.length === 0) {
            alertify.error("Please select at least one order.");
            return;
        }

        alertify.confirm(
            "Bulk Update Order Status",
            `Are you sure you want to change ${this.state.selectedOrders.length} order(s) status to "${newStatus}"?`,
            () => {
                this.props.actions.bulkUpdateOrderStatus(this.state.selectedOrders, newStatus);
                this.setState({ selectedOrders: [], showBulkActions: false });
            },
            () => {
                alertify.error("Bulk update cancelled.");
            }
        );
    };

    handleBulkDelete = () => {
        if (this.state.selectedOrders.length === 0) {
            alertify.error("Please select at least one order.");
            return;
        }

        alertify.confirm(
            "Bulk Delete Orders",
            `Are you sure you want to delete ${this.state.selectedOrders.length} order(s)? This action cannot be undone.`,
            () => {
                this.state.selectedOrders.forEach(orderId => {
                    this.props.actions.deleteOrder(orderId);
                });
                this.setState({ selectedOrders: [], showBulkActions: false });
            },
            () => {
                alertify.error("Bulk deletion cancelled.");
            }
        );
    };

    handleSelectOrder = (orderId) => {
        const { selectedOrders } = this.state;
        if (selectedOrders.includes(orderId)) {
            this.setState({
                selectedOrders: selectedOrders.filter(id => id !== orderId),
                showBulkActions: selectedOrders.length > 1,
            });
        } else {
            this.setState({
                selectedOrders: [...selectedOrders, orderId],
                showBulkActions: true,
            });
        }
    };

    handleSelectAll = () => {
        const filteredOrders = this.getFilteredOrders();
        if (this.state.selectedOrders.length === filteredOrders.length) {
            this.setState({ selectedOrders: [], showBulkActions: false });
        } else {
            this.setState({
                selectedOrders: filteredOrders.map(order => order.id),
                showBulkActions: true,
            });
        }
    };

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    handleStatusFilterChange = (e) => {
        this.setState({ statusFilter: e.target.value });
    };

    handleDateFromChange = (e) => {
        this.setState({ dateFrom: e.target.value });
    };

    handleDateToChange = (e) => {
        this.setState({ dateTo: e.target.value });
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

    getOrderStatistics = () => {
        const { orders } = this.props;
        if (!orders || !orders.orders) {
            return { total: 0, pending: 0, shipped: 0, delivered: 0, cancelled: 0, totalRevenue: 0 };
        }

        const allOrders = orders.orders || [];
        return {
            total: allOrders.length,
            pending: allOrders.filter(o => o.status === "pending").length,
            shipped: allOrders.filter(o => o.status === "shipped").length,
            delivered: allOrders.filter(o => o.status === "delivered").length,
            cancelled: allOrders.filter(o => o.status === "cancelled").length,
            totalRevenue: allOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
        };
    };

    getFilteredOrders = () => {
        const { orders } = this.props;
        const { searchTerm, statusFilter, dateFrom, dateTo } = this.state;

        if (!orders || !orders.orders) {
            return [];
        }

        let filtered = Array.isArray(orders.orders) ? orders.orders : [];

        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order && order.status === statusFilter);
        }

        if (dateFrom) {
            filtered = filtered.filter((order) => {
                if (!order.orderDate) return false;
                return new Date(order.orderDate) >= new Date(dateFrom);
            });
        }

        if (dateTo) {
            filtered = filtered.filter((order) => {
                if (!order.orderDate) return false;
                const orderDate = new Date(order.orderDate);
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                return orderDate <= toDate;
            });
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
        const { searchTerm, statusFilter, dateFrom, dateTo, selectedOrders, showBulkActions } = this.state;

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
        const stats = this.getOrderStatistics();
        const allSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;

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

                <Row className="g-4" style={{ marginBottom: "2rem" }}>
                    <Col md="3" sm="6">
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
                                Total Orders
                            </div>
                        </div>
                    </Col>
                    <Col md="3" sm="6">
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#ffffff",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#92400e", marginBottom: "0.5rem" }}>
                                {stats.pending}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Pending
                            </div>
                        </div>
                    </Col>
                    <Col md="3" sm="6">
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#ffffff",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#1e40af", marginBottom: "0.5rem" }}>
                                {stats.shipped}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Shipped
                            </div>
                        </div>
                    </Col>
                    <Col md="3" sm="6">
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#ffffff",
                                padding: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#065f46", marginBottom: "0.5rem" }}>
                                {stats.delivered}
                            </div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Delivered
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
                        <Input
                            type="date"
                            placeholder="From Date"
                            value={dateFrom}
                            onChange={this.handleDateFromChange}
                            style={{
                                width: "180px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0",
                                padding: "0.75rem 1rem",
                                fontSize: "0.875rem",
                            }}
                        />
                        <Input
                            type="date"
                            placeholder="To Date"
                            value={dateTo}
                            onChange={this.handleDateToChange}
                            style={{
                                width: "180px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0",
                                padding: "0.75rem 1rem",
                                fontSize: "0.875rem",
                            }}
                        />
                    </div>

                    {showBulkActions && selectedOrders.length > 0 && (
                        <div
                            style={{
                                padding: "1rem",
                                backgroundColor: "#f9fafb",
                                border: "1px solid #e5e7eb",
                                marginBottom: "1.5rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <span style={{ fontSize: "0.875rem", color: "#1a1a1a", fontWeight: "500" }}>
                                {selectedOrders.length} order(s) selected
                            </span>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                <Button
                                    size="sm"
                                    onClick={() => this.handleBulkStatusChange("pending")}
                                    style={{
                                        backgroundColor: "#fef3c7",
                                        color: "#92400e",
                                        border: "none",
                                        fontSize: "0.75rem",
                                        padding: "0.5rem 1rem",
                                    }}
                                >
                                    Set Pending
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => this.handleBulkStatusChange("shipped")}
                                    style={{
                                        backgroundColor: "#dbeafe",
                                        color: "#1e40af",
                                        border: "none",
                                        fontSize: "0.75rem",
                                        padding: "0.5rem 1rem",
                                    }}
                                >
                                    Set Shipped
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => this.handleBulkStatusChange("delivered")}
                                    style={{
                                        backgroundColor: "#d1fae5",
                                        color: "#065f46",
                                        border: "none",
                                        fontSize: "0.75rem",
                                        padding: "0.5rem 1rem",
                                    }}
                                >
                                    Set Delivered
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={this.handleBulkDelete}
                                    style={{
                                        backgroundColor: "#fee2e2",
                                        color: "#991b1b",
                                        border: "none",
                                        fontSize: "0.75rem",
                                        padding: "0.5rem 1rem",
                                    }}
                                >
                                    Delete Selected
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => this.setState({ selectedOrders: [], showBulkActions: false })}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#6b7280",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "0.75rem",
                                        padding: "0.5rem 1rem",
                                    }}
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    )}

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
                                                width: "50px",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={this.handleSelectAll}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
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
                                        const isSelected = selectedOrders.includes(order.id);
                                        return (
                                            <tr key={order.id}>
                                                <td style={{ padding: "1rem" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => this.handleSelectOrder(order.id)}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </td>
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
                                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
                                                        <button
                                                            onClick={() => this.handleDeleteOrder(order.id, order.orderNumber)}
                                                            style={{
                                                                background: "transparent",
                                                                border: "none",
                                                                color: "#ef4444",
                                                                cursor: "pointer",
                                                                fontSize: "0.75rem",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.5px",
                                                                padding: "0",
                                                            }}
                                                            onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                                                            onMouseLeave={(e) => (e.target.style.opacity = "1")}
                                                        >
                                                            Delete
                                                        </button>
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
            deleteOrder: bindActionCreators(orderActions.deleteOrder, dispatch),
            bulkUpdateOrderStatus: bindActionCreators(orderActions.bulkUpdateOrderStatus, dispatch),
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagementWrapper);
