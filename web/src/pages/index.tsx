import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import { GetServerSidePropsContext} from "next";
import {Pagination} from "@/components/pagination";

const inter = Inter({subsets: ["latin"]});

interface IPagination<T> {
  data: T[];
  pageSize: number;
  count: number;
}

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: IPagination<TUserItem>
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext<{
  page: number
}>): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch(`http://localhost:3000/users?page=${ctx.query.page}`, {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, users: {
        data: [], count: 0, pageSize: 20
      }}}
    }

    return {
      props: {statusCode: 200, users: await res.json()}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: {
          data: [], count: 0, pageSize: 20
        }}}
  }
})


export default function Home({statusCode, users}: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          {/*TODO add pagination*/}
          <Pagination
            totalCount={
                users.count
            }
            pageSize={users.pageSize} />
        </Container>
      </main>
    </>
  );
}
