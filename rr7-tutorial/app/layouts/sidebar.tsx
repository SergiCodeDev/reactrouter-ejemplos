// import { Outlet } from "react-router";
//
// export default function SidebarLayout() {
//   return <Outlet />;
// }

import { useEffect, useState } from 'react'
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useNavigation,
  useSubmit,
} from 'react-router'
import { getContacts } from '../data'
import type { Route } from './+types/sidebar'

// cargar datos

// Cliente

// export async function clientLoader() {
//   const contacts = await getContacts();
//   return { contacts };
// }

// Servidor

// export async function loader() {
//   const contacts = await getContacts()
//   return { contacts }
// }

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  if (q === '') {
    return redirect(url.pathname)
  }
  const contacts = await getContacts(q)
  return { contacts, q }
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  // const { contacts } = loaderData
  const { contacts, q } = loaderData
  const navigation = useNavigation()
  const submit = useSubmit()
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q')

  // no controlado
  // useEffect(() => {
  //   const searchField = document.getElementById('q')
  //   if (searchField instanceof HTMLInputElement) {
  //     searchField.value = q || ''
  //   }
  // }, [q])

  // the query now needs to be kept in state
  const [query, setQuery] = useState(q || '')

  // we still have a `useEffect` to synchronize the query
  // to the component state on back/forward button clicks
  useEffect(() => {
    setQuery(q || '')
  }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            // onChange={(event) => submit(event.currentTarget)}
            onChange={(event) => {
              const isFirstSearch = q === null
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              })
            }}
            role="search"
          >
            <input
              aria-label="Search contacts"
              className={searching ? 'loading' : ''}
              defaultValue={q || ''} // add
              id="q"
              name="q"
              // synchronize user's input to component state
              // controlado
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search"
              type="search"
              // switched to `value` from `defaultValue`
              // controlado
              value={query}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {/* 
          <ul>
            <li>
            <Link to={`/contacts/1`}>Your Name</Link>
            </li>
            <li>
            <Link to={`/contacts/2`}>Your Friend</Link>
            </li>
          </ul> 
          */}
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? (
                      <span>★</span>
                    ) : null}
                  </Link> */}
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={
          navigation.state === 'loading' && !searching ? 'loading' : ''
        }
        id="detail"
      >
        <Outlet />
      </div>
    </>
  )
}
