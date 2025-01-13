namespace SeekMatch.Application
{
    public static class Utils
    {
        private static readonly char[] PasswordChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_-+=<>?".ToCharArray();
        private static readonly Random Random = new Random();

        public static string GenerateTemporaryPassword(int length = 12)
        {
            var password = new char[length];

            for (int i = 0; i < length; i++)
            {
                password[i] = PasswordChars[Random.Next(PasswordChars.Length)];
            }

            return new string(password);
        }
    }
}
