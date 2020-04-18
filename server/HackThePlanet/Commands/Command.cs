namespace HackThePlanet
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Reflection;


	public abstract class Command
	{
		public static Dictionary<string, Type> Index;

		private string[] arguments;

		public string GetArgument(int index)
		{
			if (this.arguments == null
				|| index > this.arguments.Length - 1)
			{
				return null;
			}

			return this.arguments[index];
		}

		#region Constructors
		protected Command() {}


		static Command()
		{
			Index = new Dictionary<string, Type>();
			
			Type[] types = Assembly.GetExecutingAssembly().GetTypes();
			Type[] commandTypes = 
				(from Type type in types 
				where type.IsSubclassOf(typeof(Command)) 
				select type).ToArray();
			foreach (Type type in commandTypes)
			{
				CommandAttribute commandAttribute = type.GetCustomAttribute<CommandAttribute>();
				if (commandAttribute == null)
					continue;

				Index.Add(commandAttribute.Name.ToLower(), type);
			}
		}
		#endregion


		/// <summary>
		/// Executes the command upon Game state.
		/// </summary>
		/// <param name="game">Game state object.</param>
		/// <returns>Data to send back to the client, if any.</returns>
		public abstract string Execute(Game game);


		/// <summary>
		/// Parse a command string into a Command object that can be executed.
		/// </summary>
		/// <param name="commandString">Command string to parse.</param>
		/// <returns>Command object on which Execute() can be invoked.</returns>
		public static Command ParseCommand(string commandString)
		{
			if (string.IsNullOrEmpty(commandString))
				return null;
			
			string[] parts = commandString.Split(' ');
			
			string commandName = parts[0].ToLower();
			if (!Index.ContainsKey(commandName))
			{
				return new InvalidCommand();
			}

			Command command = (Command)Activator.CreateInstance(Index[commandName]);
			
			// No arguments.
			if (parts.Length < 2)
				return command;
			
			Console.Out.WriteLine("Parts: " + parts.Length);
			int numberOfArguments = parts.Length - 1;
			string[] arguments = new string[numberOfArguments];
			Console.Out.WriteLine("Arguments: " + arguments.Length);
			
			for (int i = 1; i < parts.Length; i++)
			{
				Console.Out.WriteLine(i);
				arguments[i - 1] = parts[i];
			}

			command.arguments = arguments;
			
			return command;
		}
	}
}