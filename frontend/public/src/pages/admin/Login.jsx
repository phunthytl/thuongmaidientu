export default function Login() {
  return (
    <div className="min-h-screen flex bg-brand-surface">
      {/* Left 40% - Form */}
      <div className="w-full lg:w-[40%] bg-brand-base flex flex-col justify-center px-12 lg:px-24">
        <div className="max-w-sm">
          <h1 className="text-3xl font-serif mb-2 text-brand-dark">Authorization</h1>
          <p className="text-sm text-gray-500 mb-12 tracking-wide">Enter your credentials to access the internal system.</p>
          
          <form className="flex flex-col gap-6" onSubmit={e => { e.preventDefault(); window.location.href = '/admin'; }}>
            <div className="relative">
              <input 
                type="email" 
                className="w-full border-b border-gray-300 py-3 text-brand-dark bg-transparent focus:outline-none focus:border-brand-dark transition-colors peer placeholder-transparent"
                placeholder="Email"
                id="email"
                required
              />
              <label htmlFor="email" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-dark peer-valid:-top-4 peer-valid:text-xs">
                Directorate Email
              </label>
            </div>
            
            <div className="relative mt-2">
              <input 
                type="password" 
                className="w-full border-b border-gray-300 py-3 text-brand-dark bg-transparent focus:outline-none focus:border-brand-dark transition-colors peer placeholder-transparent"
                placeholder="Password"
                id="password"
                required
              />
              <label htmlFor="password" className="absolute left-0 top-3 text-sm text-gray-400 transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-dark peer-valid:-top-4 peer-valid:text-xs">
                Access Code
              </label>
            </div>
            
            <button 
              type="submit"
              className="mt-8 bg-brand-dark text-white py-4 uppercase tracking-widest text-xs hover:bg-brand-accent transition-colors duration-500"
            >
              Initialize Session
            </button>
          </form>
        </div>
      </div>
      
      {/* Right 60% - Aesthetic Tension */}
      <div className="hidden lg:flex w-[60%] bg-brand-dark relative items-center justify-center overflow-hidden">
        {/* A massive typographic or geometric background */}
        <div className="absolute text-[20vw] font-serif text-white opacity-5 tracking-tighter leading-none select-none">
          C<br/>A<br/>R
        </div>
        <div className="z-10 text-center">
            <p className="text-brand-accent uppercase tracking-[0.5em] text-sm">Autovanguard</p>
            <div className="h-[1px] w-24 bg-brand-accent mx-auto mt-6"></div>
        </div>
      </div>
    </div>
  );
}
