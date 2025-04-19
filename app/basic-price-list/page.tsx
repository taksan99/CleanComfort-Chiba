import BasicPriceList from "../components/BasicPriceList"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function BasicPriceListPage() {
  return (
    <Layout>
      <Header />
      <main>
        <BasicPriceList />
      </main>
      <Footer />
    </Layout>
  )
}
