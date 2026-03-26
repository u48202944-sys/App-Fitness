-- Inserir módulos de exemplo
INSERT INTO public.modules (id, title, description, thumbnail_url, duration_minutes, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Fundamentos do Treino', 'Aprenda os conceitos básicos para começar sua jornada fitness com segurança e eficiência.', '/images/module-1.jpg', 45, 1),
  ('22222222-2222-2222-2222-222222222222', 'Treino de Força', 'Desenvolva sua força muscular com exercícios progressivos e técnicas avançadas.', '/images/module-2.jpg', 60, 2),
  ('33333333-3333-3333-3333-333333333333', 'Cardio e Resistência', 'Melhore sua capacidade cardiovascular e resistência com treinos dinâmicos.', '/images/module-3.jpg', 50, 3),
  ('44444444-4444-4444-4444-444444444444', 'Flexibilidade e Mobilidade', 'Aumente sua flexibilidade e previna lesões com alongamentos e exercícios de mobilidade.', '/images/module-4.jpg', 30, 4),
  ('55555555-5555-5555-5555-555555555555', 'Nutrição para Performance', 'Entenda como a alimentação impacta seus resultados e otimize sua dieta.', '/images/module-5.jpg', 40, 5)
ON CONFLICT DO NOTHING;

-- Inserir vídeos de exemplo para cada módulo
INSERT INTO public.videos (id, module_id, title, description, video_url, duration_minutes, order_index) VALUES
  -- Módulo 1: Fundamentos
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Introdução ao Treino', 'Visão geral do programa e o que esperar.', 'https://example.com/video1', 10, 1),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Aquecimento Correto', 'Como fazer um aquecimento eficiente antes do treino.', 'https://example.com/video2', 15, 2),
  ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Postura e Execução', 'Aprenda a executar exercícios com a postura correta.', 'https://example.com/video3', 20, 3),
  
  -- Módulo 2: Treino de Força
  ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Exercícios Compostos', 'Os melhores exercícios para ganho de força.', 'https://example.com/video4', 20, 1),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Progressão de Carga', 'Como aumentar a carga de forma segura.', 'https://example.com/video5', 15, 2),
  ('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Treino de Pernas', 'Foco em quadríceps, glúteos e posteriores.', 'https://example.com/video6', 25, 3),
  
  -- Módulo 3: Cardio
  ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'HIIT para Iniciantes', 'Treino intervalado de alta intensidade.', 'https://example.com/video7', 20, 1),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Cardio de Baixo Impacto', 'Opções para preservar as articulações.', 'https://example.com/video8', 15, 2),
  ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Resistência Aeróbica', 'Como melhorar seu condicionamento.', 'https://example.com/video9', 15, 3),
  
  -- Módulo 4: Flexibilidade
  ('d1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Alongamento Dinâmico', 'Preparo antes do treino.', 'https://example.com/video10', 10, 1),
  ('d2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Yoga para Atletas', 'Poses essenciais para recuperação.', 'https://example.com/video11', 15, 2),
  ('d3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Mobilidade de Quadril', 'Exercícios para maior amplitude.', 'https://example.com/video12', 5, 3),
  
  -- Módulo 5: Nutrição
  ('e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Macronutrientes', 'Entenda proteínas, carboidratos e gorduras.', 'https://example.com/video13', 15, 1),
  ('e2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Timing Nutricional', 'Quando comer para maximizar resultados.', 'https://example.com/video14', 10, 2),
  ('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Suplementação Básica', 'Quais suplementos realmente funcionam.', 'https://example.com/video15', 15, 3)
ON CONFLICT DO NOTHING;

-- Inserir itens de checklist diário
INSERT INTO public.checklist_items (id, title, description, category, order_index) VALUES
  ('c1000001-0000-0000-0000-000000000001', 'Beber 2L de água', 'Mantenha-se hidratado durante todo o dia', 'hidratacao', 1),
  ('c1000002-0000-0000-0000-000000000002', 'Tomar café da manhã saudável', 'Comece o dia com energia', 'nutricao', 2),
  ('c1000003-0000-0000-0000-000000000003', 'Fazer treino do dia', 'Complete sua sessão de exercícios', 'treino', 3),
  ('c1000004-0000-0000-0000-000000000004', 'Comer proteína em cada refeição', 'Garanta a recuperação muscular', 'nutricao', 4),
  ('c1000005-0000-0000-0000-000000000005', 'Alongar por 10 minutos', 'Mantenha sua flexibilidade', 'mobilidade', 5),
  ('c1000006-0000-0000-0000-000000000006', 'Dormir 7-8 horas', 'Priorize a recuperação', 'descanso', 6),
  ('c1000007-0000-0000-0000-000000000007', 'Evitar alimentos processados', 'Escolha alimentos naturais', 'nutricao', 7),
  ('c1000008-0000-0000-0000-000000000008', 'Caminhar 10.000 passos', 'Mantenha-se ativo durante o dia', 'cardio', 8)
ON CONFLICT DO NOTHING;
