document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:3000/json')
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of new Map(data.reverse()).entries()) {
                try {
                    typeof value === "string" ? null : value = JSON.stringify(value);
                    const div = document.createElement("div")
                    div.classList.add("form-group");

                    const label = document.createElement("label")
                    label.setAttribute("for", key)
                    label.innerText = key;
                    div.append(label);

                    const input = document.createElement("input")
                    input.classList.add("form-control");
                    input.name = key;
                    typeof value === "string" ? input.placeholder = value : null;
                    div.append(input);

                    document.getElementById("userForm").prepend(div);

// Display
                    const li = document.createElement("li")
                    li.classList.add("list-group-item");
                    li.innerText = `${key}: ${value}`;
                    document.getElementById("userInfoDisplayList").prepend(li);
                } catch (error) {
                    // console.warn(error)
                }
            }
            // document.getElementById('userPhoto').src = data.photo.url;
            // document.getElementById('userName').innerText = `${data.namePrefix} ${data.firstName} ${data.middleName} ${data.lastName} ${data.nameSuffix}`;
            // document.getElementById('userEmail').innerText = data.email;
            // document.getElementById('userPhone').innerText = data.cellPhone;
            // // // document.getElementById('userAddress').innerText = `${data.homeAddress.street}, ${data.homeAddress.city}, ${data.homeAddress.stateProvince}, ${data.homeAddress.postalCode}, ${data.homeAddress.countryRegion}`;
            // document.getElementById('userGitHub').href = data.url;
            // document.getElementById('userGitHub').innerText = "GitHub";
            // document.getElementById('userLinkedIn').href = data.socialUrls.linkedIn;
            // document.getElementById('userLinkedIn').innerText = "LinkedIn";

            // document.getElementById('userInfoCard').style.display = 'block';
        })
        .catch(error => console.error('Error fetching data:', error));
});