import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './styles/App.css';
import Loader from './components/utils/Loader';
import { Toaster } from 'react-hot-toast';


const Home = lazy(()=>import('./pages/common/Home'));
const Login = lazy(()=>import('./pages/common/Login'));
const Signup = lazy(()=>import('./pages/common/Signup'));
const Profile = lazy(()=>import("./pages/user/Profile"));
const Dashboard =  lazy(()=>import('./pages/admin/main/Dashboard'));
const Products = lazy(()=>import("./pages/admin/main/Products"));
const Transcation = lazy(()=>import("./pages/admin/main/Transcation"));
const Users= lazy(()=>import("./pages/admin/main/Users"));
const Bar = lazy(()=>import("./pages/admin/charts/Bar"));
const Pie = lazy(()=>import("./pages/admin/charts/Pie"));
const Line = lazy(()=>import("./pages/admin/charts/Line"));
const Stopwatch = lazy(()=>import("./pages/admin/apps/Stopwatch"));
const Coupon = lazy(()=>import("./pages/admin/apps/Coupon"));
const Manage = lazy(()=>import("./pages/admin/manage/ManageProduct"));
const OrderManage = lazy(()=>import("./pages/admin/manage/ManageOrder"));
const Shop = lazy(()=>import("./pages/common/Shop"));
const ProductsPage = lazy(()=>import("./pages/shop/ProductShop"));
const Cart = lazy(()=>import("./pages/shop/Cart"));
const Checkout = lazy(()=>import("./pages/shop/Checkout"));
const Notfound = lazy(()=>import('./pages/common/Notfound'));
const Payment = lazy(()=>import('./pages/shop/Payment'));
const My = lazy(()=>import('./pages/user/My'));
const Myapp = lazy(()=>import('./pages/user/Myapp'));
const Myorder = lazy(()=>import('./pages/user/Myorder'));
const Mypasword = lazy(()=>import('./pages/user/Mypassword'));
const OrderDetail = lazy(()=>import('./pages/user/OrderDetail'));
const Sell = lazy(()=>import('./pages/common/Sell'));


function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Comman Routes */}

          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/shop/:id' element={<ProductsPage />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/sell' element={<Sell />} />

          {/* User Routes */}

          <Route path="/user/:id" element={<Profile />} />
          <Route path='/my/:id' element={<My />} />
          <Route path='/my/password/:id' element={<Mypasword />} />
          <Route path='/my/app/:id' element={<Myapp />} />
          <Route path='/my/orders/:id' element={<Myorder />} />


          {/* Admin Routes */}

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/transactions" element={<Transcation />} />

          {/* Manage */}

          <Route path='/admin/products/:id' element={<Manage />} />
          <Route path='/admin/transactions/:id' element={<OrderManage />} />
          <Route path='/order/:id' element={<OrderDetail />} />

          {/* Charts */}

          <Route path="/admin/bar" element={<Bar />} />
          <Route path="/admin/pie" element={<Pie />} />
          <Route path="/admin/line" element={<Line />} />

          {/* Apps */}

          <Route path="/admin/stopwatch" element={<Stopwatch/>} />
          <Route path="/admin/coupon" element={<Coupon/>} />


          <Route path='*' element={<Notfound/>} />

        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
