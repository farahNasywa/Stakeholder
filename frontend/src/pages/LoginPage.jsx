// import React, { useState } from 'react';
// import './LoginPage.css';
// import { useNavigate } from 'react-router-dom';


// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const eyeIcon = 'https://cdn-icons-png.flaticon.com/512/9726/9726597.png';
//   const eyeOffIcon = 'https://cdn-icons-png.flaticon.com/512/159/159604.png';

//   const handleLogin = (e) => {
//     e.preventDefault();

//     const users = [
//       { email: 'bpma@gmail.com', password: 'bpma123' },
//       { email: 'medco@gmail.com', password: 'medco123' },
//       { email: 'pema@gmail.com', password: 'pema123' },
//       { email: 'aceh.energy@gmail.com', password: 'aceh123' },
//       { email: 'triangle@gmail.com', password: 'triangle123' },
//       { email: 'conrad@gmail.com', password: 'conrad123' },
//     ];

//     const found = users.find(user => user.email === email && user.password === password);

//     if (found) {
//       const nameMap = {
//         'bpma@gmail.com': 'BPMA',
//         'medco@gmail.com': 'Medco',
//         'triangle@gmail.com': 'Triangle Pasee',
//         'conrad@gmail.com': 'Conrad',
//         'pema@gmail.com': 'Pema',
//         'aceh.energy@gmail.com': 'Aceh Energy'
//       };

//       localStorage.setItem('email', email);
//       localStorage.setItem('name', nameMap[email] || 'Pengguna');

//       alert(`Login berhasil untuk ${email}`);
//       navigate('/welcome');
//     } else {
//       alert('Email atau password salah');
//     }
//   };

//   return (
//     <div
//       className="login-page"
//       style={{
//         backgroundImage: `url("/images/bg-stakeholder2.jpg")`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//       }}
//     >
//       <div className="overlay"></div>
//       <div className="login-container">
//         <div className="form-box">
//           <h1>Login</h1>
//           <p className="subtext">Sign in with your email and password</p>
//           <form onSubmit={handleLogin}>
//             <div className="input-group">
//               <input
//                 type="email"
//                 value={email}
//                 placeholder="Email address"
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group password-group">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 placeholder="Password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
//                 <img src={showPassword ? eyeOffIcon : eyeIcon} alt="toggle password" />
//               </span>
//             </div>
//             <button type="submit" className="login-btn">Login</button>
//           </form>
//           <p className="footer">© 2026 Stakeholder - BPMA</p>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';
import './LoginPage.css'; // Pastikan file CSS ini ada dan berisi gaya yang diinginkan
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Pastikan URL ikon ini bisa diakses
  const eyeIcon = 'https://cdn-icons-png.flaticon.com/512/9726/9726597.png';
  const eyeOffIcon = 'https://cdn-icons-png.flaticon.com/512/159/159604.png';

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('1. Tombol Login ditekan.');

    try {
      console.log('2. Mengirim request login ke backend...');
      // Pastikan port sesuai dengan backend Anda (5050)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('3. Mendapat response dari server. Status:', response.status);
      const data = await response.json();
      console.log('4. Data respons dari server:', data);

      if (response.ok && data.user && data.token) { // Pastikan ada data user DAN token
        console.log('Login berhasil! Menyimpan data dan mengarahkan...');
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('name', data.user.name || '');
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('token', data.token); // Simpan tokennya!

        console.log('5. Mengarahkan ke halaman /welcome...');
        navigate('/welcome'); 
      } else {
        console.log('6. Login gagal. Pesan dari server:', data.message);
        // Menggunakan alert untuk notifikasi ke pengguna
        alert(data.message || 'Email atau password salah');
      }
    } catch (err) {
      console.error('7. Terjadi kesalahan saat fetch atau koneksi:', err);
      // Menggunakan alert untuk notifikasi ke pengguna
      alert('Terjadi kesalahan saat login');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url("/images/bg-stakeholder2.jpg")`, // <<< INI SUDAH DIHAPUS KOMENTARNYA
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="overlay"></div>
      <div className="login-container">
        <div className="form-box">
          <h1>Login</h1>
          <p className="subtext">Sign in with your email and password</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                <img src={showPassword ? eyeOffIcon : eyeIcon} alt="toggle password" />
              </span>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className="footer">© 2026 Stakeholder - BPMA</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
