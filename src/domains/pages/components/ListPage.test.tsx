import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import type { Column } from '@umituz/web-design-system/organisms';
import { ListPage } from './ListPage';

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  site: string;
}

const DEVICES: readonly Device[] = [
  { id: 'dev-1', name: 'North Gate Reader', status: 'online', site: 'HQ' },
  { id: 'dev-2', name: 'Server Door Sensor', status: 'offline', site: 'DC' },
  { id: 'dev-3', name: 'Lobby Camera', status: 'online', site: 'HQ' },
];

const COLUMNS: readonly Column<Device>[] = [
  { id: 'name', header: 'Device', accessor: 'name' },
  { id: 'status', header: 'Status', accessor: 'status' },
];

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
}

function mount(props: Partial<Parameters<typeof ListPage<Device>>[0]> = {}) {
  return render(
    <MemoryRouter>
      <LocationProbe />
      <Routes>
        <Route
          path="/"
          element={
            <ListPage<Device>
              title="Devices"
              description="Field hardware"
              data={DEVICES}
              columns={COLUMNS}
              {...props}
            />
          }
        />
        <Route path="/devices/:id" element={<output>detail</output>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ListPage', () => {
  it('renders header and every row', () => {
    mount();
    expect(screen.getByText('Devices')).toBeDefined();
    expect(screen.getByText('North Gate Reader')).toBeDefined();
    expect(screen.getByText('Server Door Sensor')).toBeDefined();
    expect(screen.getByText('Lobby Camera')).toBeDefined();
  });

  it('filters rows by search terms', () => {
    mount({ search: { terms: (row) => [row.name, row.site] } });
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'camera' } });
    expect(screen.getByText('Lobby Camera')).toBeDefined();
    expect(screen.queryByText('North Gate Reader')).toBeNull();
  });

  it('filters rows by select default matcher and custom matcher', () => {
    mount({
      filters: [{ id: 'status', label: 'Status', options: [{ value: 'online', label: 'Online' }] }],
    });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'online' } });
    expect(screen.queryByText('Server Door Sensor')).toBeNull();
    expect(screen.getByText('Lobby Camera')).toBeDefined();
  });

  it('honours a custom matchFilter', () => {
    mount({
      filters: [{ id: 'campus', label: 'Campus', options: [{ value: 'hq', label: 'HQ' }] }],
      matchFilter: (row, id, value) => id === 'campus' && row.site.toLowerCase() === value,
    });
    fireEvent.change(screen.getByLabelText('Campus'), { target: { value: 'hq' } });
    expect(screen.getByText('Lobby Camera')).toBeDefined();
    expect(screen.queryByText('Server Door Sensor')).toBeNull();
  });

  it('shows the count of shown vs total', () => {
    mount({ search: { terms: (row) => row.name } });
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'gate' } });
    expect(screen.getByTestId('list-page-count').textContent).toBe('1 of 3');
  });

  it('navigates via rowLink on row click', () => {
    mount({ rowLink: (row) => `/devices/${row.id}` });
    fireEvent.click(screen.getByText('Lobby Camera'));
    expect(screen.getByTestId('location').textContent).toBe('/devices/dev-3');
  });

  it('keeps table passthrough escape hatches working', () => {
    const onRowClick = vi.fn();
    mount({
      columns: [{ id: 'name', header: 'Device', accessor: 'name' }],
      table: { onRowClick, sortable: true },
    });
    fireEvent.click(screen.getByText('Lobby Camera'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('renders custom cells from column config', () => {
    mount({
      columns: [
        { id: 'name', header: 'Device', cell: (row) => `${row.name}!` },
        { id: 'status', header: 'Status', cell: (row) => <em>{row.status}</em> },
      ],
    });
    expect(screen.getByText('Lobby Camera!')).toBeDefined();
    expect(screen.getAllByText('online', { selector: 'em' }).length).toBe(2);
  });

  it('shows the DataTable empty state when no row matches', () => {
    mount({
      search: { terms: (row) => row.name },
      table: { emptyState: { title: 'No devices', description: 'Try another search' } },
    });
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'zzz' } });
    expect(screen.getByText('No devices')).toBeDefined();
    expect(screen.getByText('Try another search')).toBeDefined();
    expect(screen.queryByText('Lobby Camera')).toBeNull();
  });

  it('honours label overrides', () => {
    mount({
      search: { terms: (row) => row.name },
      labels: { searchPlaceholder: 'Cihaz ara', countShown: () => 'üç' },
    });
    expect(screen.getByPlaceholderText('Cihaz ara')).toBeDefined();
    expect(screen.getByTestId('list-page-count').textContent).toBe('üç');
  });
});
