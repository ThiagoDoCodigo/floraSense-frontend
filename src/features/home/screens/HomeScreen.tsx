import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LayoutDashboard, ArrowRight } from 'lucide-react-native';

import { Header, CustomCard, Button, colors } from 'react-native-th-components';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Header 
        title="Painel de Controle" 
        subtitle="Visão geral dos seus módulos" 
        icon={LayoutDashboard} 
      />

      <View style={styles.content}>
        <CustomCard 
          title="Testar Fluxo de Navegação"
          description="Navegue para uma tela aninhada dentro desta mesma aba (Stack dentro de Tab)."
          bottomButtonText="Abrir Tela Interna"
          onPressBottom={() => navigation.navigate('TestStack')}
        />
      </View>
      
      <Button 
        variant="danger" 
        label="Sair do App (Logout)" 
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'AuthFlow' }] })} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },
  content: { flex: 1, marginTop: 16 },
});