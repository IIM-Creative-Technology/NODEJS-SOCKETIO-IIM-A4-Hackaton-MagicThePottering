import { FC, useState } from 'react';

const LoginPage: FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [requestError, setRequestError] = useState<string | null>(null);
  const [canEditFields, setCanEditFields] = useState<boolean>(true);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  function onInputChange (
    newUsername: string | null,
    newPassword: string | null,
  ) {
    if (newUsername != null) setUsername(newUsername);
    if (newPassword != null) setPassword(newPassword);
    setCanSubmit((newUsername ?? username).length > 0 && (newPassword ?? password).length > 0);
  }

  function tryToLogin (): void {
    if (!canEditFields || !canSubmit) return;
    setCanEditFields(false);
    setCanSubmit(false);
    setRequestError(null);
    fetch(
      '/login',
      {
        method : 'POST',
        headers: [['Content-Type', 'application/json']],
        body   : JSON.stringify({
          username,
          password,
        }),
      })
      .then(async (r) => ({ data: await r.json(), r }))
      .then(({ r, data }) => {
        if (!r.ok) {
          throw data;
        }
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_id', data.id)
        localStorage.setItem('username', data.username)
        localStorage.setItem('house_id', data.house_id)
        location.assign('/');
      })
      .catch(({ message }: { message: string }) => {
        setCanEditFields(true);
        setRequestError(message);
      });
  }

  return (
    <>
      <h1>Entrer à Poudlard</h1>
      {requestError && <h2>{requestError}</h2>}
      <input placeholder="Utilisateur"
             type="text"
             disabled={!canEditFields}
             readOnly={!canEditFields}
             onChange={(event) => onInputChange(event.target.value, null)} />
      <input placeholder="Mot de passe"
             type="password"
             disabled={!canEditFields}
             readOnly={!canEditFields}
             onChange={(event) => onInputChange(null, event.target.value)} />
      <input type="submit"
             disabled={!canSubmit}
             onClick={tryToLogin}
             value="Se connecter" />
    </>
  );
};

export default LoginPage;
