import MainLayout from '../MainLayout';

export default function WithMainLayout(WrappedComponent: React.ComponentType<any>) {
  return function EnhancedComponent(props: any) {
    return (
      <MainLayout>
        <WrappedComponent {...props} />
      </MainLayout>
    );
  };
}