import { Toaster } from "sonner";
import Layout from './layout/layout';
import RoutesApp from './routes/router-app';

function App() {
  return (
    <Layout>
      <Toaster expand={true} />
      <RoutesApp />
    </Layout>
  )
}

export default App;