-- Paddle Billing fields and safe subscription defaults for TrustDrop.
alter table public.businesses
  add column if not exists paddle_customer_id text,
  add column if not exists paddle_subscription_id text,
  add column if not exists paddle_updated_at timestamptz,
  add column if not exists paddle_last_event_id text;

create unique index if not exists businesses_paddle_subscription_id_key
  on public.businesses (paddle_subscription_id)
  where paddle_subscription_id is not null;

-- New accounts use the existing 14-day TrustDrop trial until Paddle confirms payment.
alter table public.businesses
  alter column plan set default 'free',
  alter column subscription_status set default 'trialing',
  alter column trial_ends_at set default (now() + interval '14 days');

-- Temporary paid-access defaults were used while setting up the payment provider.
-- Return non-Paddle accounts to the existing trial/expiry lifecycle.
update public.businesses
set
  plan = case
    when subscription_status = 'expired' then 'free'
    else 'free'
  end,
  subscription_status = case
    when coalesce(trial_ends_at, (created_at at time zone 'UTC') + interval '14 days') > now()
      then 'trialing'
    else 'expired'
  end,
  trial_ends_at = coalesce(trial_ends_at, (created_at at time zone 'UTC') + interval '14 days')
where paddle_subscription_id is null
  and subscription_status = 'active';
