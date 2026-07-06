import { useState } from "react";

function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  // Tasas actuales
  const rates = { UYU: 42.50, ARS: 850.00, BRL: 5.20 };

  return (
    <div style={{ 
      background: '#0a2a1a', 
      padding: '15px', 
      borderRadius: '12px', 
      color: '#e0ffe0',
      border: '1px solid #1a5a3a',
      fontSize: '12px',
      width: '100%'
    }}>
      {/* Cuadrito de Valores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '15px' }}>
        <div style={{ background: '#0e3d24', padding: '5px', borderRadius: '4px' }}>UYU: ${rates.UYU}</div>
        <div style={{ background: '#0e3d24', padding: '5px', borderRadius: '4px' }}>ARS: ${rates.ARS}</div>
        <div style={{ background: '#0e3d24', padding: '5px', borderRadius: '4px' }}>BRL: ${rates.BRL}</div>
        <div style={{ background: '#0e3d24', padding: '5px', borderRadius: '4px', textAlign:'center' }}>USD: $1.00</div>
      </div>

      {/* Función de Conversión */}
      <div style={{ borderTop: '1px solid #1a5a3a', paddingTop: '10px' }}>
        <div style={{ marginBottom: '8px', color: '#88cc88', fontWeight: 'bold' }}>Conversor Rápido:</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Input Dólares */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '10px', marginBottom: '2px', color: '#aaa' }}>Dólares (USD)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '70px', borderRadius: '4px', border: 'none', padding: '4px', background: '#0e3d24', color: 'white' }}
            />
          </div>

          <span style={{ marginTop: '15px', color: '#88cc88' }}>=</span>

          {/* Resultado Pesos */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '10px', marginBottom: '2px', color: '#aaa' }}>Pesos (UYU)</label>
            <div style={{ background: '#1a5a3a', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#fff' }}>
              ${(amount * rates.UYU).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyConverter;