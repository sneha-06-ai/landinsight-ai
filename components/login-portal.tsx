"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

const LandMap = dynamic(() => import("./land-map"), {
  ssr: false,
  loading: () => <div className="login-map-loading">Loading land intelligence</div>,
});

export default function LoginPortal() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/");
  };

  return <main className="login-page">
    <section className="login-visual" aria-label="LandInsight platform">
      <div className="login-map"><LandMap activeLayer="Climate vulnerability" satelliteView={false} compact /></div>
      <div className="login-visual-wash" />
      <Link className="login-brand" href="/" aria-label="Bhoomi-Niti Home">
        <span className="login-brand-mark"><span /></span>
        <span><strong>bhoomi<span style={{ color: "#d97706" }}>.niti</span></strong><small>National Land Governance Layer · SIH 2026</small></span>
      </Link>
      <div className="login-visual-copy">
        <span className="login-kicker"><i /> BHOOMI-NITI · PROBLEM ID: 26019</span>
        <h1>Evidence that helps us<br /><em>see the whole cadastre.</em></h1>
        <p>Connecting research, policy experimentation, legal knowledge, and geospatial evidence across India.</p>
        <div className="login-visual-meta"><span><ShieldCheck size={14} /> PostGIS Encrypted</span><span>28 States · One Unified Cadastral Network</span></div>
      </div>
      <div className="login-map-caption">CADASTRAL & CLIMATE LAYERS <span>PERSON-PARCEL-PIXEL</span></div>
    </section>

    <section className="login-form-side">
      <Link className="login-back" href="/"><ArrowLeft size={15} /> Back to platform</Link>
      <div className="login-form-wrap">
        <div className="login-form-heading">
          <span className="login-lock"><LockKeyhole size={18} /></span>
          <span className="login-kicker">ACCOUNT ACCESS</span>
          <h2>Welcome back</h2>
          <p>Use demo access to continue to the platform.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Work email</label>
          <input id="login-email" name="email" type="email" autoComplete="username" placeholder="name@organization.gov.in" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <div className="login-password-label"><label htmlFor="login-password">Password</label><span>Organization account</span></div>
          <div className="login-password-field">
            <input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          <button className="login-submit" type="submit">Login <ArrowRight size={15} /></button>
        </form>

        <div className="login-provider-note"><ShieldCheck size={15} /><p><strong>Demo access only</strong><span>Authentication is not configured. Credentials are not checked, sent or stored.</span></p></div>
        <p className="login-help">Need an account? Contact your workspace administrator.</p>
      </div>
      <footer className="login-footer"><span><LockKeyhole size={12} /> Protected Government Gateway</span><span>Bhoomi-Niti · Team Neural Minds · SIH 2026</span></footer>
    </section>
  </main>;
}