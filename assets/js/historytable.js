$(document).ready(function () {
    var tok = sessionStorage.getItem("Token");
    var firstname = sessionStorage.getItem("First Name")
    var lastname = sessionStorage.getItem("Last Name")
    $('#table1').DataTable({
        ajax: {
            url: `http://localhost:5000/assisted_student_votes_logs/` + firstname + " " + lastname,
            dataSrc: "",
            beforeSend: function (request) {
                request.setRequestHeader("authorization", tok);
            }
        },
        autoWidth: false,
        responsive: true,
        columns: [
            { data: "vote_student_id" },
            {
                data: "created_at",
                render: function (data) {
                    var date = new Date(data)
                    return date;
                }
            },
        ],
        language: {
            loadingRecords: `<div class="spinner-border text-secondary" role="status"></div><span>&nbsp&nbspGathering Records...</span>`
        },

    });

})