import { useState, useEffect } from "react";
import { Button, Accordion, Spinner, Form, FormGroup } from "react-bootstrap";
import {
  AddExpenseItems,
  GetItemsByUserId,
  LoggedInData,
  updateExpenseItems,
} from "../Services/DataService";

const ExpenseManager = ({ userId }) => {
  const [show, setShow] = useState(false);
  const [ExpenseDescription, setExpenseDescription] = useState("");
  const [ExpenseCategory, setExpenseCategory] = useState("");
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ExpenseAmount, setExpenseAmount] = useState(0);
  const [ExpenseId, setExpenseId] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ExpenseItems, setExpenseItems] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      let userExpenseItems = await GetItemsByUserId(userId);
      setExpenseItems(userExpenseItems);
      setIsLoading(false);
    };
    loadUserData();
  }, [userId]);

  const handleSave = async () => {
    const published = {
      Id: edit ? ExpenseId : 0,
      UserId: userId,
      Description: ExpenseDescription,
      Category: ExpenseCategory,
      Amount: ExpenseAmount,
      IsPublished: false,
      IsDeleted: false,
    };
    handleClose();
    let result = edit
      ? await updateExpenseItems(published)
      : await AddExpenseItems(published);

    if (result) {
      let userExpenseItems = await GetItemsByUserId(userId);
      setExpenseItems(userExpenseItems);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    setShow(true);
    if (item) {
      setEdit(true);
      setExpenseAmount(item.amount);
      setExpenseId(item.id);
      setExpenseDescription(item.description);
      setExpenseCategory(item.category);
    } else {
      setEdit(false);
      setExpenseAmount(0);
      setExpenseDescription("");
      setExpenseCategory("");
    }
  };

  const handleDelete = async (item) => {
    item.isDeleted = !item.isDeleted;
    let result = await updateExpenseItems(item);
    if (result) {
      let userExpenseItems = await GetItemsByUserId(userId);
      setExpenseItems(userExpenseItems);
    }
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={() => handleShow(null)}
      >
        Add Expense Item
      </Button>

      <Form.Group controlId="CategoryFilter" className="mb-3">
        <Form.Label>Filter by Category</Form.Label>
        <Form.Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Groceries">Groceries</option>
          <option value="Utils">Utils</option>
          <option value="Entertainment">Entertainment</option>
        </Form.Select>
      </Form.Group>

      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <Accordion>
          {ExpenseItems.filter(
            (item) =>
              selectedCategory === "All" || item.category === selectedCategory
          ).map((item) => (
            <Accordion.Item key={item.id} eventKey={item.id}>
              <Accordion.Header>{item.description}</Accordion.Header>
              <Accordion.Body>
                <p>Amount: {item.amount}</p>
                <p>Category: {item.category}</p>
                <Button onClick={() => handleShow(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item)}>
                  {item.isDeleted ? "Restore" : "Delete"}
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default ExpenseManager;
