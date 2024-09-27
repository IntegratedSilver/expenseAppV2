import { Container } from "react-bootstrap";
import ExpenseManager from "./ExpenseManager";
import { LoggedInData } from "../Services/DataService";

const Dashboard = ({ isDarkMode, onLogin }) => {
  const userInfo = LoggedInData();
  onLogin(userInfo);

  return (
    <Container className={isDarkMode ? "bg-dark text-light p-5" : "bg-light"} fluid>
      <ExpenseManager userId={userInfo.userId} />
    </Container>
  );
};

export default Dashboard;
