
import React, { useContext } from 'react'
import { AuthContext } from '../App'
import './Premium.css'

const Premium = ({ onUpgrade }) => {
  const { user, isAuthenticated } = useContext(AuthContext)

  const handlePlanSelection = (planType) => {
    if (!isAuthenticated) {
      alert('Você precisa fazer login primeiro!')
      return
    }

    const plans = {
      individual: { name: 'Premium Individual', price: 'R$ 19,90/mês' },
      familia: { name: 'Premium Família', price: 'R$ 29,90/mês' },
      estudante: { name: 'Premium Estudante', price: 'R$ 9,90/mês' }
    }

    const selectedPlan = plans[planType]
    const confirmed = window.confirm(
      `Confirmar assinatura do ${selectedPlan.name} por ${selectedPlan.price}?`
    )

    if (confirmed) {
      alert(`Parabéns! Você agora é um assinante ${selectedPlan.name}!`)
      if (onUpgrade) onUpgrade()
    }
  }

  return (
    <div className="premium-page modal-page">
      <div className="premium-header">
        <h1>🎵 Premium</h1>
        <p>Aproveite música sem limites com o Premium</p>
        {isAuthenticated && (
          <p className="welcome-message">Olá, {user?.name}! Escolha seu plano:</p>
        )}
      </div>

      <div className="premium-content">
        <div className="premium-plans">
          <div className="plan-card">
            <h3>Premium Individual</h3>
            <div className="price">R$ 19,90/mês</div>
            <ul>
              <li>✓ Música sem anúncios</li>
              <li>✓ Download para ouvir offline</li>
              <li>✓ Qualidade de áudio superior</li>
              <li>✓ Pular quantas vezes quiser</li>
            </ul>
            <button 
              className="premium-btn"
              onClick={() => handlePlanSelection('individual')}
            >
              Começar agora
            </button>
          </div>

          <div className="plan-card featured">
            <div className="popular-badge">Mais popular</div>
            <h3>Premium Família</h3>
            <div className="price">R$ 29,90/mês</div>
            <ul>
              <li>✓ Todos os benefícios do Individual</li>
              <li>✓ 6 contas Premium</li>
              <li>✓ Mix familiar</li>
              <li>✓ Controle parental</li>
            </ul>
            <button 
              className="premium-btn"
              onClick={() => handlePlanSelection('familia')}
            >
              Começar agora
            </button>
          </div>

          <div className="plan-card">
            <h3>Premium Estudante</h3>
            <div className="price">R$ 9,90/mês</div>
            <ul>
              <li>✓ Todos os benefícios do Individual</li>
              <li>✓ 50% de desconto</li>
              <li>✓ Verificação estudantil necessária</li>
              <li>✓ Oferta por tempo limitado</li>
            </ul>
            <button 
              className="premium-btn"
              onClick={() => handlePlanSelection('estudante')}
            >
              Começar agora
            </button>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="login-prompt">
            <p>Para assinar um plano Premium, você precisa ter uma conta.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Premium
