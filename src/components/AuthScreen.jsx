import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Feather,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Shield,
} from 'lucide-react';

export const AuthScreen = () => {
  const { login, register } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student'); // 'student' | 'professor'

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Введите логин и академический пароль для входа');
      return;
    }

    const res = login(loginIdentifier, loginPassword);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!regName.trim() || !regLogin.trim() || !regPassword) {
      setError('Все поля обязательны для внесения в табель');
      return;
    }

    if (regPassword.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      return;
    }

    const res = register({
      name: regName,
      login: regLogin,
      password: regPassword,
      role: regRole,
    });

    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-[#16161a] overflow-y-auto">
      {/* Background vignette & ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#722f37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#1c1b22] border-2 border-[#d4af37]/50 rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col my-auto">
        {/* Antique Header Banner */}
        <div className="bg-gradient-to-b from-[#722f37] via-[#4a1820] to-[#1c1b22] p-6 text-center border-b border-[#d4af37]/30 relative">
          <div className="w-14 h-14 mx-auto mb-2.5 rounded-full bg-[#16161a] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-lg">
            <Feather className="w-7 h-7" />
          </div>

          <span className="text-[10px] uppercase font-display tracking-widest text-[#f3e29f] block">
            КАФЕДРА ПРИКЛАДНОГО ПОВИНОВЕНИЯ
          </span>
          <h1 className="text-xl font-bold font-serif-vintage text-[#fffffe] tracking-wide mt-1">
            Академический реестр
          </h1>
          <p className="text-xs text-[#a7a9be] font-serif-vintage italic mt-0.5">
            Дневник преподавателя и его дипломницы
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Security Banner */}
          <div className="p-2.5 rounded-xl bg-[#16161a] border border-[#2e2b38] flex items-center space-x-2 text-[11px] text-[#a7a9be]">
            <KeyRound className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="font-serif-vintage italic">
              Вход строго по персональному логину и паролю кафедры.
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#16161a] p-1 border border-[#2e2b38]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#722f37] text-[#fffffe] shadow-sm'
                  : 'text-[#8f90a6] hover:text-[#c5c6d0]'
              }`}
            >
              Авторизация в системе
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-[#722f37] text-[#fffffe] shadow-sm'
                  : 'text-[#8f90a6] hover:text-[#c5c6d0]'
              }`}
            >
              Новая регистрация
            </button>
          </div>

          {/* Error Message Banner */}
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-600/50 flex items-center space-x-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Strict Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
                  Логин или Email кафедры:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#717388] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="zhunus или iza"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
                  Академический пароль:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#717388] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#722f37] via-[#8e3b45] to-[#4a1820] text-[#fffffe] text-xs font-bold tracking-wider border border-[#d4af37]/60 shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Войти в личный кабинет</span>
                <ArrowRight className="w-4 h-4 text-[#f3e29f]" />
              </button>

              {/* Discrete Academic Credentials Footnote */}
              <div className="pt-2 border-t border-[#2e2b38]/60 text-center">
                <span className="text-[10px] text-[#717388] block font-serif-vintage italic">
                  Учетные данные кафедры:
                </span>
                <span className="text-[10px] text-[#a7a9be] block font-mono mt-0.5">
                  Преподаватель: <strong className="text-[#f3e29f]">zhunus</strong> / <strong className="text-[#f3e29f]">veritas123</strong>
                </span>
                <span className="text-[10px] text-[#a7a9be] block font-mono mt-0.5">
                  Студентка: <strong className="text-[#f3e29f]">iza</strong> / <strong className="text-[#f3e29f]">student123</strong>
                </span>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1.5">
                  Статус на кафедре:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      regRole === 'student'
                        ? 'bg-[#722f37]/50 border-[#d4af37] text-[#f3e29f]'
                        : 'bg-[#16161a] border-[#2e2b38] text-[#8f90a6]'
                    }`}
                  >
                    <span>🥀 Студентка</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('professor')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      regRole === 'professor'
                        ? 'bg-[#722f37]/50 border-[#d4af37] text-[#f3e29f]'
                        : 'bg-[#16161a] border-[#2e2b38] text-[#8f90a6]'
                    }`}
                  >
                    <span>🏛️ Преподаватель</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
                  Полное имя / Обращение:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#717388] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={regRole === 'student' ? 'Иза Любознательная' : 'Жунус Абаевич'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
                  Логин или Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#717388] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regLogin}
                    onChange={(e) => setRegLogin(e.target.value)}
                    placeholder="user@academy.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
                  Пароль:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#717388] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#722f37] via-[#8e3b45] to-[#4a1820] text-[#fffffe] text-xs font-bold tracking-wider border border-[#d4af37]/60 shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5 pt-2"
              >
                <span>Зарегистрироваться в табеле</span>
                <Sparkles className="w-4 h-4 text-[#f3e29f]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
