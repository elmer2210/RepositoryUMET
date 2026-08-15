module.exports = {
  apps: [{
    name: 'dspace-angular',
    script: '/home/dspace/dspace-angular/dist/server/main.js',
    cwd: '/home/dspace/dspace-angular',
    exec_mode: 'fork',
    instances: 1,
    max_memory_restart: '900M',
    node_args: '--max-old-space-size=800 --stack-size=2000',
    env: {
      NODE_ENV: 'production'
    },
    kill_timeout: 5000,
    restart_delay: 2000
  }]
};
