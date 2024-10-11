import React from 'react'
import * as BUI from '@thatopen/ui'

export function UsersPage() {
  const userTable = BUI.Component.create<BUI.Table>(() => {
    const onTableCreated = (element?: Element) => {
      const table = element as BUI.Table

      table.data = [
        {
          data: {
            Name: 'John Doe',
            Task: 'Create Work Orders',
            Role: 'Engineer',
          },
        },
        {
          data: {
            Name: 'John 2',
            Task: 'Content',
            Role: 'Contet Creator',
          },
        },
        {
          data: {
            Name: 'John 3',
            Task: 'Deisgn',
            Role: 'Designer',
          },
        },
      ]
    }
    return BUI.html`
    <bim-table ${BUI.ref(onTableCreated)}>
    <bim-table/>
    `
  })

  const content = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
    <bim-panel style="border-radius: 0px">
    <bim-panel-section label="Tasks">
      ${userTable}
      </bim-panel-section>
    </bim-panel>
    `
  })

  const sidebar = BUI.Component.create<BUI.Component>(() => {
    const buttonStyles = {
      height: '50px',
    }

    return BUI.html`
    <div style="padding: 4px">
    <bim-button style=${BUI.styleMap(buttonStyles)} icon="teenyicons:print-outline" @click=${() => {
      console.log(userTable.value)
    }}></bim-button>
    <bim-button style=${BUI.styleMap(buttonStyles)} icon="ph:file" @click=${() => {
      const cvsData = userTable.csv
      const blob = new Blob([cvsData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'user.csv'
      a.click()
    }}></bim-button>
    </div>
    `
  })

  const footer = BUI.Component.create<BUI.Component>(() => {
    return BUI.html`
           <div style="display: flex; justify-center:center;">
           <bim-label>copyright 2021</bim-label>
           </div>
            `
  })

  const gridLayout: BUI.Layouts = {
    primary: {
      template: `
    "header header" 40px
    "content sidebar" 1fr
    "footer footer" 40px
    / 1fr 60px
    `,
      elements: {
        header: (() => {
          const inputBox = BUI.Component.create<BUI.TextInput>(() => {
            return BUI.html`
            <bim-text-input style="padding: 8px" placeholder="Search Users"></bim-text-input>
            `
          })

          inputBox.addEventListener('input', () => {
            userTable.queryString = inputBox.value
          })

          return inputBox
        })(),
        sidebar,
        content,
        footer,
      },
    },
  }

  React.useEffect(() => {
    const grid = document.getElementById('bimGrid') as BUI.Grid
    grid.layouts = gridLayout
    grid.layout = 'primary'
  }, [])

  return (
    <div>
      <bim-grid id='bimGrid'></bim-grid>
    </div>

    // <div
    //   className='page'
    //   id='users-page'>
    //   <dialog id='new-user-modal'>
    //     <form>
    //       <h2>New User</h2>
    //       <div className='input-list'>
    //         <div className='form-field-container'>
    //           <label>
    //             <span className='material-icons-round'>people</span>Last nane
    //           </label>
    //           <input
    //             type='text'
    //             placeholder='Last name?'
    //           />
    //         </div>
    //         <div className='form-field-container'>
    //           <label>
    //             <span className='material-icons-round'>people</span>First Name
    //           </label>
    //           <input
    //             type='text'
    //             placeholder='First name?'
    //           />
    //         </div>
    //         <div className='form-field-container'>
    //           <label>
    //             <span className='material-icons-round'>person</span>Role
    //           </label>
    //           <select>
    //             <option>Admin</option>
    //             <option>Contractor</option>
    //             <option>Developer</option>
    //           </select>
    //         </div>
    //         <div className='form-field-container'>
    //           <label>
    //             <span className='material-icons-round'>not_listed_location</span>
    //             Permission
    //           </label>
    //           <select>
    //             <option>User</option>
    //             <option>Admin</option>
    //             <option>Viewer</option>
    //           </select>
    //         </div>
    //         <div
    //           style={{
    //             display: 'flex',
    //             margin: '10px 0px 10px auto',
    //             columnGap: 10,
    //           }}>
    //           <button style={{ backgroundColor: 'transparent' }}>Cancel</button>
    //           <button style={{ backgroundColor: 'rgb(18, 145, 18)' }}>Accept</button>
    //         </div>
    //       </div>
    //     </form>
    //   </dialog>
    //   <header>
    //     <div>
    //       <h2>User Panel</h2>
    //       <p style={{ color: '#969696' }}>List of users</p>
    //     </div>
    //   </header>
    //   <div className='main-page-content'>
    //     <div
    //       style={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         rowGap: 10,
    //         padding: 30,
    //       }}>
    //       <div
    //         className='user-card'
    //         style={{ padding: '12px 0', backgroundColor: 'gray' }}>
    //         <div
    //           style={{
    //             display: 'flex',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             padding: '0px 30px',
    //           }}>
    //           <span style={{ width: 80 }}>Admins</span>
    //           <span style={{ width: 80 }}>1 users</span>
    //           <span
    //             style={{
    //               fontSize: 15,
    //               backgroundImage: 'url(/assets/profileImg1.jpg)',
    //               backgroundPosition: 'center',
    //               backgroundSize: 'cover',
    //               borderRadius: '100%',
    //               padding: 12,
    //             }}>
    //             1
    //           </span>
    //           <span>16 projects</span>
    //           <button className='btn-secondary'>
    //             <p style={{ width: '100%' }}>add user</p>
    //           </button>
    //         </div>
    //       </div>
    //       <div
    //         className='user-card'
    //         style={{ padding: '12px 0', backgroundColor: 'gray' }}>
    //         <div
    //           style={{
    //             display: 'flex',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             padding: '0px 30px',
    //           }}>
    //           <span style={{ width: 80 }}>Contractors</span>
    //           <span style={{ width: 80 }}>2 users</span>
    //           <div style={{ display: 'flex', flexDirection: 'row', width: 50 }}>
    //             <span
    //               style={{
    //                 fontSize: 15,
    //                 backgroundImage: 'url(/assets/profileImg2.jpg)',
    //                 backgroundPosition: 'center',
    //                 backgroundSize: 'cover',
    //                 borderRadius: '100%',
    //                 padding: 12,
    //               }}>
    //               2
    //             </span>
    //             <span
    //               style={{
    //                 fontSize: 15,
    //                 backgroundImage: 'url(/assets/profileImg3.jpg)',
    //                 backgroundPosition: 'center',
    //                 backgroundSize: 'cover',
    //                 borderRadius: '100%',
    //                 padding: 12,
    //               }}>
    //               3
    //             </span>
    //           </div>
    //           <span>12 projects</span>
    //           <button className='btn-secondary'>
    //             <p style={{ width: '100%' }}>add user</p>
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
