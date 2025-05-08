import React, { useState } from 'react'
import UserDataContext from '../context/UserContext'

const UserContext = ({children}) => {

    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: '',
        }
    })

      return (
        <UserDataContext.Provider value={{user, setUser}}>
        {children}
        </UserDataContext.Provider>
  )
}

export default UserContext