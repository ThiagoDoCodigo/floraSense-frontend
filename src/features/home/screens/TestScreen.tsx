import { View, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';
import { Header, Typography } from 'react-native-th-components';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Header 
        title="Configurações Internas" 
        subtitle="Você navegou para dentro da Stack" 
        icon={Settings} 
      />
      <Typography align="center" style={{ marginTop: 20 }}>
        Esta tela possui o botão de voltar nativo configurado na Stack. O Tab Bar lá embaixo continua visível, garantindo a navegação raiz.
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
});