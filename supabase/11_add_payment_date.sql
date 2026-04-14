-- Adiciona colunas para controle de status e data de pagamento
alter table public.sale_transactions 
add column if not exists payment_status text default 'paid',
add column if not exists payment_date timestamp with time zone;

-- Migração de dados existentes: 
-- Se a venda já estava paga (pelo método ou status), inicializa a data de pagamento com a data da venda
update public.sale_transactions 
set payment_date = date 
where (payment_status = 'paid' or payment_method != 'À receber') 
and payment_date is null;
