document.addEventListener('DOMContentLoaded', ()=> {
    fetch(`http://127.0.0.1:3000/vcard/${new this.URL(location).searchParams.get("extendedKey")}/json`)
        .then(response => response.json())
        .then(data => {
            for (const [key, value] of new Map(data).entries()) {
                if (!value) break;
                if (typeof value !== "string") break;
                try {
                    //  console.log([key,value])
                    const li = document.createElement("li")
                    li.classList.add("list-group-item");
                    li.innerText = `${key}: ${value}`;

                    // const div = document.createElement("div")
                    // div.classList.add("input-group");
                    // li.append(div);

                    // const button = document.createElement("button")
                    // button.classList.add("btn", "btn-outline-secondary")
                    // button.innerText = key;
                    // div.append(button);

                    // const p = document.createElement("input");
                    // p.classList.add("form-control");
                    // // p.setAttribute("disabled", "disabled");
                    // p.placeholder = value;
                    // div.append(p);

                    document.getElementById("userInfoDisplayList").append(li);
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