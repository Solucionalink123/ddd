
import React, { useState, useContext } from 'react'
import { AuthContext } from '../App'
import './Support.css'

const Support = () => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    category: 'geral'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envio
    setTimeout(() => {
      alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.')
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
        category: 'geral'
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleFAQClick = (question) => {
    const answers = {
      'Como cancelar assinatura?': 'Você pode cancelar sua assinatura nas configurações da conta.',
      'Como baixar músicas?': 'Com o Premium, você pode baixar músicas tocando no ícone de download.',
      'Problemas de reprodução?': 'Verifique sua conexão e tente reiniciar o app.',
      'Como mudar qualidade?': 'Vá em Configurações > Qualidade de áudio para ajustar.'
    }
    alert(answers[question] || 'Consulte nossa documentação completa.')
  }

  return (
    <div className="support-page modal-page">
      <div className="support-header">
        <h1>🎧 Central de Ajuda</h1>
        <p>Como podemos te ajudar hoje?</p>
      </div>

      <div className="support-content">
        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Perguntas Frequentes</h2>
          <div className="faq-grid">
            {[
              'Como cancelar assinatura?',
              'Como baixar músicas?',
              'Problemas de reprodução?',
              'Como mudar qualidade?'
            ].map(question => (
              <button
                key={question}
                className="faq-item"
                onClick={() => handleFAQClick(question)}
              >
                <span>❓</span>
                <span>{question}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-section">
          <h2>Entre em Contato</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="geral">Dúvida Geral</option>
                <option value="tecnico">Problema Técnico</option>
                <option value="pagamento">Pagamento/Assinatura</option>
                <option value="sugestao">Sugestão</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assunto</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Descreva brevemente o problema"
                required
              />
            </div>

            <div className="form-group">
              <label>Mensagem</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Descreva detalhadamente sua dúvida ou problema..."
                rows="5"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => alert('Redefinindo senha...')}>
              🔐 Redefinir Senha
            </button>
            <button className="action-btn" onClick={() => alert('Atualizando dados...')}>
              📝 Atualizar Perfil
            </button>
            <button className="action-btn" onClick={() => alert('Verificando conta...')}>
              ✅ Verificar Conta
            </button>
            <button className="action-btn" onClick={() => alert('Relatando problema...')}>
              🐛 Reportar Bug
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Support
