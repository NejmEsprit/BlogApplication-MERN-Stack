import AdminMain from "./AdminMain";
import AdminSidebar from "./AdminSidebar";
import "./admin.css"

const AdminDashboard = () => {
    return (
        <section className="admin-dashboard">
            <AdminSidebar />
            <AdminMain />
        </section>

    );
}

export default AdminDashboard;