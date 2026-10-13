export default function PageFooter({ tripTitle }: { tripTitle: string }) {
  return (
    <footer className="page-footer">
      <span>
        Hecho con <span className="heart">♥</span> para viajar juntos
      </span>
      <span>{tripTitle}</span>
    </footer>
  );
}
