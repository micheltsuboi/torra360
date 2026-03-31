-- Adicionar validade nas configurações
ALTER TABLE loyalty_settings ADD COLUMN IF NOT EXISTS expiry_days INTEGER DEFAULT 365;

-- Adicionar data de expiração nas transações
ALTER TABLE loyalty_transactions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Lógica para calcular expiração ao inserir (opcional via Trigger ou manual no App)
-- Vamos fazer manual no App para maior controle sobre feriados/regras de negócio se necessário.

-- Atualizar view de saldo ou queries para filtrar expirados
-- Por enquanto as queries no App farão o filtro: WHERE (expires_at IS NULL OR expires_at > now()) OR type = 'REDEEMED'
