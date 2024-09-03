using Microsoft.EntityFrameworkCore;
using Projekt.Data;
using Projekt.Models;

namespace Projekt.Repository
{
    public class EmployeeRepository
    {
        private readonly AppDbContext db;
        public EmployeeRepository(AppDbContext dbContext)
        {
            this.db = dbContext;
        }
        public async Task<List<Employee>> GetAllEmployee()
        {
            return await db.Employees.ToListAsync();
        }
        public async Task SaveEmployee(Employee emp)
        {
            await db.Employees.AddAsync(emp);
            await db.SaveChangesAsync();
        }
        public async Task updateEmployee(int id, Employee obj)
        {
            var employee = await db.Employees.FindAsync(id);
            if (employee == null)
            {
                throw new Exception("Employee not found.");
            }
            employee.Name = obj.Name;
            employee.Email = obj.Email;
            employee.Mobile = obj.Mobile;
            employee.Age = obj.Age;
            employee.Salary = obj.Salary;
            employee.Status = obj.Status;

            await db.SaveChangesAsync();
        }
        public async Task DeleteEmployee(int id)
        {
            var employee = await db.Employees.FindAsync(id);
            if(employee == null)
            {
                throw new Exception("Employee not found.");
            }
            db.Employees.Remove(employee);
            await db.SaveChangesAsync();
        }
    }
}
