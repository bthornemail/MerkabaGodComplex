/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useState} from 'react'

export default function CustomFileInput() {
  // const fileInput = useRef<HTMLInputElement>(null)
  function handleChange(e: any) {
    const fileName = e.target.files[0].name;
    // Do something with the file name, like displaying it somewhere
    alert("File chosen: " + fileName);
  }
  return (<div className="custom-file btn btn-lg btn-outline-light" style={{width:"auto"}}>
    <input type="file" id="inputGroupFile01" className="form-control form-control-lg"
      aria-describedby="inputGroupFileAddon01" style={{display: "none"}} onChange={handleChange}/>
      <label htmlFor="inputGroupFile01">
        <img src="/src/images/2192072-200.png" style={{cursor: "pointer",height:'1.5rem',width:'1.5rem'}} alt="Upload" />
      </label>
      <style>{`
        .custom-file-input {
          display: none;
          /* Hide the actual input */
        }

        .custom-file label img {
          /* Add any styles here for your image */
          width: 50px;
          /* Example size */
          height: 50px;
        }

      `}
      </style>
  </div>)
}