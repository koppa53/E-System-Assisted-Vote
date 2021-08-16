$(document).ready(function () {
    var tok = sessionStorage.getItem("Token");
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] != "pass") {
                if (b[i] > 1) {
                    if (a[i] == 0) return false;
                    if (a[i] > b[i]) return false;
                } else {
                    if (a[i] !== b[i]) return false;
                }
            }
        }
        return true;
    }

    function foo(array) {
        let a = [],
            b = [],
            arr = [...array], // clone array so we don't change the original when using .sort()
            prev;
        for (let element of arr) {
            if (element != -1) {
                if (element !== prev) {
                    a.push(element);
                    b.push(1);
                }
                else ++b[b.length - 1];
                prev = element;
            } else {
                a.push(element);
                b.push("pass");
            }
        }

        return [a, b];
    }

    let verifiedStudent = 0
    let verifiedStudentID = ""
    $('#verifyStudent').click(async (event) => {
        event.preventDefault();
        const id = $('#studid').val()
        if (id.length == 0) {
            Swal.fire({
                icon: "error",
                allowOutsideClick: false,
                title: "Please Enter Student ID"
            })
        } else {
            const response = await fetch('http://localhost:5000/student_has_voted/' + id, {
                method: "GET",
                headers: {
                    'authorization': tok,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: data.message
                })
                verifiedStudent = 1
                verifiedStudentID = id
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.message
                })
                verfiiedStudent = 2
            }
        }
    })

    let allUSCVotes = new Array()
    let allCSCVotes = new Array()
    $('#verify').click(function () {
        if (verifiedStudent == 0) {
            Swal.fire({
                icon: "error",
                title: "Please Validate Student Before Verifying or Submitting Votes.",
                allowOutsideClick: false,
            })
            return;
        }
        if (verifiedStudent == 2) {
            Swal.fire({
                icon: "error",
                allowOutsideClick: false,
                title: "Cant Submit Vote has Student Already Voted."
            })
            return;
        }
        if ($('#USCBALLOT input:checked').length == 0 && $('#CSCBALLOT input:checked').length == 0) {
            Swal.fire({
                icon: "error",
                allowOutsideClick: false,
                title: "No candidates selected."
            })
            return;
        }
        if ($('#USCBALLOT input:checked').length == 0) {
            Swal.fire({
                icon: "error",
                allowOutsideClick: false,
                title: "No USC candidates selected."
            })
            return;
        }
        if ($('#CSCBALLOT input:checked').length == 0) {
            Swal.fire({
                icon: "error",
                allowOutsideClick: false,
                title: "No CSC candidates selected."
            })
            return;
        }
        else {
            var verifyUSC = new Array();
            var verifyCSC = new Array();
            $('#USCBALLOT input:checked').each(function () {
                var split = $(this).val().split('_')
                if (split[0] != 'ABSTAINED') verifyUSC.push(split[2])
                else {
                    verifyUSC.push(-1)
                }
            })
            $('#CSCBALLOT input:checked').each(function () {
                var split = $(this).val().split('_')
                if (split[0] != 'ABSTAINED') verifyCSC.push(split[2])
                else { verifyCSC.push(-1) }
            })
            var uscmaxvote = sessionStorage.getItem("USC_LIST_OF_MAX_VOTE")
            var cscmaxvote = sessionStorage.getItem("CSC_LIST_OF_MAX_VOTE")
            var u = uscmaxvote.split(',')
            u = u.map(Number);
            var c = cscmaxvote.split(',')
            c = c.map(Number);
            const resultCSC = foo(verifyCSC);
            const resultUSC = foo(verifyUSC);
            const verifiedUSC = arraysEqual(resultUSC[1], u)
            const verifiedCSC = arraysEqual(resultCSC[1], c)
            if (verifiedUSC === true && verifiedCSC === true) {
                allUSCVotes = [];
                allCSCVotes = [];
                $("#USCVOTES").empty();
                $('#USCBALLOT input:checked').each(function () {
                    allUSCVotes.push($(this).val());
                    var split = $(this).val().split('_')
                    if (split[0] != "ABSTAINED") {
                        $("#USCVOTES").append(`
                        <li
                            class="list-group-item d-flex justify-content-between align-items-center">
                            <span>`+ split[1].toUpperCase() + " " + split[0] + `</span>
                            <span class="badge bg-primary badge-pill badge-round ml-1">`+ split[2] + `</span>
                        </li>
                        `)
                    } else {
                        $("#USCVOTES").append(`
                        <li
                            class="list-group-item d-flex justify-content-between align-items-center">
                            <span>`+ split[1].toUpperCase() + `</span>
                            <span class="badge bg-dark badge-pill badge-round ml-1">`+ split[2] + `</span>
                        </li>
                        `)
                    }

                })

                $("#CSCVOTES").empty();
                $('#CSCBALLOT input:checked').each(function () {
                    allCSCVotes.push($(this).val());
                    var split = $(this).val().split('_')
                    if (split[0] != "ABSTAINED") {
                        $("#CSCVOTES").append(`
                    <li
                        class="list-group-item d-flex justify-content-between align-items-center">
                        <span>`+ split[1].toUpperCase() + " " + split[0] + `</span>
                        <span class="badge bg-warning badge-pill badge-round ml-1">`+ split[2] + `</span>
                    </li>
                    `)
                    } else {
                        $("#CSCVOTES").append(`
                    <li
                        class="list-group-item d-flex justify-content-between align-items-center">
                        <span>`+ split[1].toUpperCase() + `</span>
                        <span class="badge bg-dark badge-pill badge-round ml-1">`+ split[2] + `</span>
                    </li>
                    `)
                    }

                })
                $('#verifyModal').modal('show');

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Votes.",
                    text: `Please Check The Required Number of Candidates in every Positions.`
                })
            }
        }
    })

    var college = sessionStorage.getItem("College")
    var firstname = sessionStorage.getItem("First Name")
    var lastname = sessionStorage.getItem("Last Name")
    $('#submitVotes').on('click', async (event) => {
        event.preventDefault()
        let success = false
        for (const v of allUSCVotes) {
            let split = v.split('_')
            const response = await fetch('http://localhost:5000/new_assisted_student_vote', {
                method: "POST",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vote_student_id: verifiedStudentID,
                    vote_election_year: split[5],
                    vote_assistant_first_name: firstname,
                    vote_assistant_last_name: lastname,
                    vote_candidate_first_name: split[0],
                    vote_candidate_last_name: split[1],
                    vote_candidate_id: split[3],
                    vote_college: college,
                    vote_candidate_position: split[2],
                    vote_council: split[4]
                })
            })
            if (response.ok) {
                success = true
            } else {
                success = false
            }
        }
        for (const v of allCSCVotes) {
            let split = v.split('_')
            const response = await fetch('http://localhost:5000/new_assisted_student_vote', {
                method: "POST",
                headers: {
                    "authorization": tok,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vote_student_id: verifiedStudentID,
                    vote_election_year: split[5],
                    vote_assistant_first_name: firstname,
                    vote_assistant_last_name: lastname,
                    vote_candidate_first_name: split[0],
                    vote_candidate_last_name: split[1],
                    vote_candidate_id: split[3],
                    vote_college: college,
                    vote_candidate_position: split[2],
                    vote_council: split[4]
                })
            })
            if (response.ok) {
                success = true
            } else {
                success = false
            }
        }
        if (success) {
            generateReciept()
            Swal.fire({
                icon: "success",
                title: "Votes Successfully Submitted",
                allowOutsideClick: false,
                text: "Thank You For Voting.",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Done'
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.clear();
                    window.location.href = "auth-login.html"
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                title: "Failed to submit Votes."
            })
        }
    })

    function generateReciept() {
        window.jsPDF = window.jspdf.jsPDF
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var doc = new jsPDF('p', 'mm', 'legal');
        doc.setFont('Helvetica', 'bold')
        doc.setFontSize(25);
        var textWidth = doc.getStringUnitWidth("BICOL UNIVERSITY") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 15, "BICOL UNIVERSITY");

        doc.setFontSize(18);
        doc.setFont('Helvetica', 'normal')
        var textWidth = doc.getStringUnitWidth("Office of the Student Affairs and Services") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 25, "Office of the Student Affairs and Services");

        doc.setFontSize(20);
        var textWidth = doc.getStringUnitWidth("USC | CSC Online Elections 2021") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 35, "USC | CSC Online Elections 2021");

        doc.setFontSize(15);
        var textWidth = doc.getStringUnitWidth(dateTime) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 45, dateTime);

        doc.setFont('Helvetica', 'bold')
        doc.setFontSize(20);
        var textWidth = doc.getStringUnitWidth("Voter Info") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 65, "Voter Info");


        doc.setFont('Helvetica', 'normal')
        doc.setFontSize(18);
        const stid = "Student ID: " + verifiedStudentID.toUpperCase()
        var textWidth = doc.getStringUnitWidth(stid) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 85, stid);

        doc.setFont('Helvetica', 'bold')
        doc.setFontSize(20);
        var textWidth = doc.getStringUnitWidth("Vote Review : USC Positions") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 105, "Vote Review : USC Positions");

        var y = 0;
        doc.setFontSize(10);
        for (var v of allUSCVotes) {
            let split = v.split('_')
            let pos = "USC " + split[2]
            doc.setFont('Helvetica', 'bold')
            let name = ""
            if (split[0] != 'ABSTAINED') {
                name = split[0].toUpperCase() + " " + split[1].toUpperCase()
            } else {
                name = split[0]
            }
            var textWidth = doc.getStringUnitWidth(pos) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(textOffset, 120 + y, pos);
            var textWidth = doc.getStringUnitWidth('________________') * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(textOffset, 122 + y, '________________');
            doc.setFont('Helvetica', 'normal')
            var textWidth = doc.getStringUnitWidth(name) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(textOffset, 127 + y, name);
            y += 20
        }

        doc.addPage('legal', 'portrait');

        /*------------------------CSC SECTION-------------------------*/

        doc.setFontSize(20);
        doc.setFont('Helvetica', 'bold')
        var textWidth = doc.getStringUnitWidth("Vote Review : CSC Positions") * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.text(textOffset, 30, "Vote Review : CSC Positions");

        var ycsc = 0;
        doc.setFontSize(10);
        for (var v of allCSCVotes) {
            let split = v.split('_')
            let pos = "CSC " + split[2]
            doc.setFont('Helvetica', 'bold')
            let name = ""
            if (split[0] != 'ABSTAINED') {
                name = split[0].toUpperCase() + " " + split[1].toUpperCase()
            } else {
                name = split[0]
            }
            var textWidth = doc.getStringUnitWidth(pos) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(textOffset, 51 + ycsc, pos);
            var textWidth = doc.getStringUnitWidth('________________') * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(textOffset, 52 + ycsc, '________________');
            doc.setFont('Helvetica', 'normal')
            var textWidth = doc.getStringUnitWidth(name) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(textOffset, 57 + ycsc, name);
            ycsc += 20
        }
        doc.output('dataurlnewwindow');
        var docTitle = verifiedStudentID + "-" + today.getFullYear() + " Vote-Reciept"
        doc.save(docTitle + '.pdf');
    }
})

function disableCandidates(e) {
    var nodes = document.getElementById(e).getElementsByTagName('input');
    for (var i = 0; i < nodes.length - 1; i++) {
        nodes[i].checked = false
        nodes[i].disabled = true;
    }
}
function enableCandidates(e) {
    var nodes = document.getElementById(e).getElementsByTagName('input');
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].disabled = false;
    }
}


