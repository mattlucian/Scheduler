using Scheduler.Data.Infrastructure;
using System;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scheduler.Data.UnitOfWork
{
    public class UnitOfWork<TContext> : Disposable, IUnitOfWork<TContext>
        where TContext : DbContext, new()
    {
        public virtual int Commit()
        {
            return _dataContext.SaveChanges();
        }

        public virtual Task<int> CommitAsync()
        {
            return _dataContext.SaveChangesAsync();
        }

        private readonly DbContext _dataContext;

        public UnitOfWork()
        {
            _dataContext = new TContext();
        }

        protected override void DisposeCore()
        {
            if (_dataContext != null)
                _dataContext.Dispose();
        }

        /// <summary>
        /// Define Repositories
        /// </summary>
        

    }
}
