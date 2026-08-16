const API = "http://localhost:3000/api/complaints";

const form = document.getElementById("complaintForm");
const complaintList = document.getElementById("complaintList");
const message = document.getElementById("message");
const search = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");


// LOAD COMPLAINTS

async function loadComplaints() {

    const response = await fetch(API);

    const complaints = await response.json();

    displayComplaints(complaints);
}


// DISPLAY COMPLAINTS

function displayComplaints(complaints) {

    const searchText = search.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    complaintList.innerHTML = "";

    const filteredComplaints = complaints.filter(complaint => {

        const matchesSearch =
            complaint.name.toLowerCase().includes(searchText) ||
            complaint.category.toLowerCase().includes(searchText) ||
            complaint.description.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            complaint.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    if (filteredComplaints.length === 0) {

        complaintList.innerHTML =
            "<p>No complaints found.</p>";

        return;
    }


    filteredComplaints.forEach(complaint => {

        const card = document.createElement("div");

        card.className = "complaint-card";


        card.innerHTML = `

            <h3>${complaint.category}</h3>

            <p>
                <strong>Resident:</strong>
                ${complaint.name}
            </p>

            <p>
                <strong>Room:</strong>
                ${complaint.room}
            </p>

            <p>
                <strong>Description:</strong>
                ${complaint.description}
            </p>

            <p>
                <strong>Priority:</strong>
                ${complaint.priority}
            </p>

            <p>
                <strong>Status:</strong>
                ${complaint.status}
            </p>

            <div class="card-buttons">

                <button onclick="viewComplaint(${complaint.id})">
                    View
                </button>

                <button
                    class="status-btn"
                    onclick="changeStatus(${complaint.id})">
                    Change Status
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteComplaint(${complaint.id})">
                    Delete
                </button>

            </div>
        `;


        complaintList.appendChild(card);
    });
}


// ADD COMPLAINT

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const complaint = {

        name: document.getElementById("name").value,

        room: document.getElementById("room").value,

        contact: document.getElementById("contact").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        date: document.getElementById("date").value,

        priority: document.getElementById("priority").value,

        additionalInfo:
            document.getElementById("additionalInfo").value
    };


    const response = await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(complaint)

    });


    const data = await response.json();


    if (response.ok) {

        message.textContent =
            "Complaint submitted successfully!";

        message.style.color = "green";

        form.reset();

        loadComplaints();

    } else {

        message.textContent = data.message;

        message.style.color = "red";
    }

});


// VIEW COMPLAINT

async function viewComplaint(id) {

    const response =
        await fetch(`${API}/${id}`);

    const complaint =
        await response.json();


    if (!response.ok) {

        alert(complaint.message);

        return;
    }


    alert(
        "Complaint Details\n\n" +

        "Resident: " + complaint.name + "\n" +

        "Room: " + complaint.room + "\n" +

        "Contact: " + complaint.contact + "\n" +

        "Category: " + complaint.category + "\n" +

        "Description: " + complaint.description + "\n" +

        "Date: " + complaint.date + "\n" +

        "Priority: " + complaint.priority + "\n" +

        "Status: " + complaint.status + "\n" +

        "Additional Info: " +
        complaint.additionalInfo
    );
}


// CHANGE STATUS

async function changeStatus(id) {

    const newStatus =
        prompt(
            "Enter status:\nPending\nIn Progress\nResolved"
        );


    if (!newStatus) {
        return;
    }


    const response = await fetch(
        `${API}/${id}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: newStatus
            })
        }
    );


    const data = await response.json();


    if (response.ok) {

        alert("Status updated successfully");

        loadComplaints();

    } else {

        alert(data.message);
    }
}


// DELETE COMPLAINT

async function deleteComplaint(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this complaint?"
        );


    if (!confirmDelete) {
        return;
    }


    const response = await fetch(
        `${API}/${id}`,
        {
            method: "DELETE"
        }
    );


    const data = await response.json();


    if (response.ok) {

        alert("Complaint deleted successfully");

        loadComplaints();

    } else {

        alert(data.message);
    }
}


// SEARCH

search.addEventListener("input", loadComplaints);


// FILTER

statusFilter.addEventListener("change", loadComplaints);


// LOAD DATA WHEN PAGE OPENS

loadComplaints();