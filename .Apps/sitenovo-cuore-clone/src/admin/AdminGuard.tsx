import { useEffect, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminApp from './AdminApp';

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function AdminGuard() {
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('cuore_admin_token');
    setValid(isTokenValid(token));
    setChecked(true);
  }, []);

  if (!checked) return null;
  if (!valid) return <Navigate to="/admin/login" replace />;
  return <AdminApp />;
}
