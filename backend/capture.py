import scapy.all as scapy
import threading
import time
from collections import defaultdict, deque

# Stats data structures
_stats = {
    'total_queries': 0,
    'domains': defaultdict(int),           # domain: count
    'clients': defaultdict(int),           # src_ip: count
    'qtype': defaultdict(int),             # type: count
    'protocols': defaultdict(int),         # protocol: count
    'ports': defaultdict(int),             # dst_port: count
    'rcode': defaultdict(int),             # rcode: count
    'queries_over_time': deque(maxlen=100),# time series (timestamp, count)
    'recent_queries': deque(maxlen=50),    # recent queries (dict per query)
}
_last_time_bucket = None
_bucket_count = 0
_capture_active = False

def list_interfaces():
    # Returns available interfaces (names only)
    return scapy.get_if_list()

def is_capturing():
    return _capture_active

def process_packet(packet):
    global _stats, _last_time_bucket, _bucket_count

    # Only handle DNS queries/responses
    if not packet.haslayer(scapy.DNSQR):
        return

    # Gather base info
    timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    src_ip = packet[scapy.IP].src if packet.haslayer(scapy.IP) else None
    dst_ip = packet[scapy.IP].dst if packet.haslayer(scapy.IP) else None
    protocol = packet.proto if hasattr(packet, 'proto') else None
    transport_proto = 'UDP' if packet.haslayer(scapy.UDP) else ('TCP' if packet.haslayer(scapy.TCP) else None)
    src_port = packet[scapy.UDP].sport if packet.haslayer(scapy.UDP) else (packet[scapy.TCP].sport if packet.haslayer(scapy.TCP) else None)
    dst_port = packet[scapy.UDP].dport if packet.haslayer(scapy.UDP) else (packet[scapy.TCP].dport if packet.haslayer(scapy.TCP) else None)
    qname = packet[scapy.DNSQR].qname.decode(errors='ignore')
    qtype = packet[scapy.DNSQR].qtype
    rcode = packet[scapy.DNS].rcode if packet.haslayer(scapy.DNS) else None
    qr = packet[scapy.DNS].qr if packet.haslayer(scapy.DNS) else 0

    # Update stats
    _stats['total_queries'] += 1
    _stats['domains'][qname] += 1
    if src_ip:
        _stats['clients'][src_ip] += 1
    if transport_proto:
        _stats['protocols'][transport_proto] += 1
    if dst_port:
        _stats['ports'][dst_port] += 1
    if qtype:
        _stats['qtype'][qtype] += 1
    if rcode is not None:
        _stats['rcode'][rcode] += 1

    # Time bucket for queries_over_time (per minute)
    current_time_bucket = int(time.time() // 60)
    if _last_time_bucket != current_time_bucket:
        _stats['queries_over_time'].append({'timestamp': timestamp, 'count': 1})
        _last_time_bucket = current_time_bucket
        _bucket_count = 1
    else:
        if _stats['queries_over_time']:
            _stats['queries_over_time'][-1]['count'] += 1
        else:
            _stats['queries_over_time'].append({'timestamp': timestamp, 'count': 1})

    # Save recent queries
    _stats['recent_queries'].append({
        'timestamp': timestamp,
        'src_ip': src_ip,
        'dst_ip': dst_ip,
        'protocol': transport_proto,
        'src_port': src_port,
        'dst_port': dst_port,
        'qname': qname,
        'qtype': qtype,
        'rcode': rcode,
        'response': bool(qr),
    })

def start_capture(interface):
    global _capture_active
    if _capture_active:
        return
    _capture_active = True
    print(f"[+] Starting DNS capture on interface: {interface}")
    scapy.sniff(
        iface=interface,
        filter="udp port 53 or tcp port 53",
        prn=process_packet,
        store=0,
        stop_filter=lambda x: not _capture_active
    )

def stop_capture():
    global _capture_active
    _capture_active = False

def get_stats():
    # Return a copy of stats for thread safety, mapped to useful names
    return {
        'total_queries': _stats['total_queries'],
        'top_domains': sorted(_stats['domains'].items(), key=lambda x: x[1], reverse=True)[:10],
        'top_clients': sorted(_stats['clients'].items(), key=lambda x: x[1], reverse=True)[:10],
        'queries_by_type': dict(_stats['qtype']),
        'queries_by_protocol': dict(_stats['protocols']),
        'queries_by_port': dict(_stats['ports']),
        'queries_by_rcode': {rcode_name(k): v for k, v in _stats['rcode'].items()},
        'queries_over_time': list(_stats['queries_over_time']),
        'recent_queries': list(_stats['recent_queries']),
    }

def rcode_name(rcode):
    # DNS response code human-readable names
    return {
        0: "NOERROR",
        1: "FORMERR",
        2: "SERVFAIL",
        3: "NXDOMAIN",
        4: "NOTIMP",
        5: "REFUSED"
    }.get(rcode, str(rcode))

def reset_stats():
    global _stats, _last_time_bucket, _bucket_count
    _stats = {
        'total_queries': 0,
        'domains': defaultdict(int),
        'clients': defaultdict(int),
        'qtype': defaultdict(int),
        'protocols': defaultdict(int),
        'ports': defaultdict(int),
        'rcode': defaultdict(int),
        'queries_over_time': deque(maxlen=100),
        'recent_queries': deque(maxlen=50),
    }
    _last_time_bucket = None
    _bucket_count = 0