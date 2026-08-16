const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Temporary data
let complaints = [];


// Test API
app.get("/", (req, res) => {
    res.send("PG Complaint Management API is working");
});


// GET all complaints
app.get("/api/complaints", (req, res) => {
    res.json(complaints);
});


// CREATE complaint
app.post("/api/complaints", (req, res) => {

    const complaint = req.body;

    if (!complaint.name || !complaint.room || !complaint.category || !complaint.description) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const newComplaint = {
        id: complaints.length + 1,
        ...complaint,
        status: "Pending"
    };

    complaints.push(newComplaint);

    res.status(201).json({
        message: "Complaint submitted successfully",
        complaint: newComplaint
    });
});


// GET one complaint
app.get("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(item => item.id === id);

    if (!complaint) {
        return res.status(404).json({
            message: "Complaint not found"
        });
    }

    res.json(complaint);
});


// UPDATE complaint status
app.put("/api/complaints/:id/status", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(item => item.id === id);

    if (!complaint) {
        return res.status(404).json({
            message: "Complaint not found"
        });
    }

    complaint.status = req.body.status;

    res.json({
        message: "Status updated successfully",
        complaint: complaint
    });
});


// DELETE complaint
app.delete("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = complaints.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Complaint not found"
        });
    }

    complaints.splice(index, 1);

    res.json({
        message: "Complaint deleted successfully"
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});