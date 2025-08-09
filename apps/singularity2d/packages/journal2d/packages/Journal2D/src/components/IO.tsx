// export function Input() {
//     const [currentLocation, setCurrentLocation] = useState("Los Angeles");
//     return (<nav style={{ display: "flex", height: "3rem" }}>
//       <Link to="/"><img src='/favicon.png' style={{ width: "2rem", height: "2rem" }} /></Link>
//       <div onClick={() => setCurrentLocation("Los Angeles")}>
//         <sup>location {">"}</sup>
//         <p>{currentLocation}</p>
//       </div>
//     </nav>)
//   }

//   export function Output({buttons}) {
//     const navigate = useNavigate()
//     return buttons.map((button)=>{
//       return <div style={{fontSize:".75rem",textAlign:"center"}} className="btn-secondary" onClick={()=>navigate(button.url)}>
//       {/* <Link to="/"> */}
//     <img src='/favicon.png' style={{ width: "1.5rem", height: "1.5rem" }} />
//     <br />
//     <sub>{button.title}</sub>
//     {/* </Link> */}
//     </div>
//     })
//   }
//   function useIO(){
//     return 
//   }

//   import { useContext } from 'react'
// import { UserAccountContext } from '../provider/User.Account.Provider'

// export const useUserAccount = () => {
//   const { address, balance ,signer}: any = useContext(UserAccountContext)
//   return { address, balance ,signer}
// }
// import PropTypes from 'prop-types'
// import {
//   useState,
//   createContext
// } from 'react'

// export const UserAccountContext = createContext({})
// export const UserAccountProvider = ({ children }: any) => {
//   const [ address, setAddress ] = useState<any>(null)
//   const [ balance, setBalance ] = useState<number>(0)
//   const [ signer, setSigner ] = useState<Wallet | null>(null)

//   function setUser(user: Wallet){
//     setAddress(user.address)
//     setBalance(0)
//     setSigner(user)
//   }
//   return (
//     <UserAccountContext.Provider
//       value={{ address, balance ,signer ,setUser, verifyMessage }}
//     >{children}</UserAccountContext.Provider>
//   )
// }

// UserAccountProvider.propTypes = {
//   children: PropTypes.any
// }
