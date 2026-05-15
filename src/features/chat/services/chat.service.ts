const INITIAL_GREETINGS = [
  "Olá, Thiago! Sou a FloraSense AI. Como posso ajudar com o seu cultivo hoje?",
  "Bem-vindo ao FloraSense AI! Analisei a telemetria recente. Quer um resumo da saúde das suas plantas?",
  "Oi! Estou monitorando as leituras do seu ESP32. Tem alguma dúvida sobre rega ou adubação?",
];

const MOCK_ANSWERS = [
  "Analisando os dados da sua Samambaia: a umidade do ar caiu para 45%. Para essa espécie, o ideal é manter acima de 60%. Sugiro borrifar água nas folhas nas próximas horas.",
  "Com base na sua última foto, notei manchas amareladas com bordas secas. Isso geralmente indica deficiência de Potássio ou baixa umidade no solo. Recomendo acionar a rega com 150ml e adicionar fertilizante NPK 10-10-10.",
  "O microclima está perfeito! A temperatura está estável em 24°C e a umidade do solo em 60%. A planta está em condições ideais para a fotossíntese.",
  "Entendido. Vou programar o ESP32 para diminuir o intervalo de leitura para 15 minutos e monitorar a absorção de água mais de perto.",
  "Essa espécie é bastante suscetível a fungos se o solo ficar encharcado. O sensor indica 80% de umidade no momento. Aconselho suspender a rega pelos próximos 3 dias.",
];

class ChatService {
  async getInitialGreeting(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(
          Math.random() * INITIAL_GREETINGS.length,
        );
        resolve(INITIAL_GREETINGS[randomIndex]);
      }, 800);
    });
  }

  async sendQuery(message: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * MOCK_ANSWERS.length);
        resolve(MOCK_ANSWERS[randomIndex]);
      }, 1500);
    });
  }
}

export default new ChatService();
