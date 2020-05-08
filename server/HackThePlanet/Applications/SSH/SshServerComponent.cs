namespace HackThePlanet
{
    using System.Collections.Generic;
    using PrimitiveEngine;


    public class SshServerComponent : IServerComponent
    {
        private const ushort RamUsePerSession = 2;


        #region Properties
        public List<UserAccount> Accounts
        {
            get
            {
                return Game.World.GetEntityById(this.OriginEntityId)?
                    .GetComponent<ComputerComponent>()?
                    .Accounts;
            }
        }


        public int OriginEntityId { get; set; }


        public Port Port
        {
            get { return Port.Ssh; }
        }


        public ushort RamUse
        {
            get
            {
                ushort count = 0;
                for (int index = 0; index < this.Accounts.Count; index++)
                {
                    if (this.Accounts[index].IsActive)
                        count++;
                }

                return (ushort)(count * RamUsePerSession);
            }
        }
        #endregion
    }
}